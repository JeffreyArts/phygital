<template>
    <div class="sandbox-view" @mousedown="cancelCameraAnimation"></div>
</template>

<script lang="ts">
import _ from "lodash"
import * as THREE from "three"
import gsap from "@/services/gsap-wrapper" 
import Phygital from "@/stores/phygital"
import AppStore from "@/stores/app"

import { phygitalSeedEvent, SculptureGroup } from "@/stores/phygital"
import { vpg3dRenderer } from "@/services/3d-view.js"

import threeDView from "@/services/3d-view.js"
import removeObject from "@/services/threejs-remove-object"



export default {
    props: ["datamodel", "modelChanged", "name"],
    setup() {
        const phygital = Phygital()
        const app = AppStore()
        return {
            phygital, app
        }
    },
    data() {
        return {
            scene: null as null | THREE.Scene,
            container: {
                width: 256,
                height: 256,
            },
            scale: 6,
            renderer: null as null | vpg3dRenderer,
            camera: null as null | THREE.PerspectiveCamera,
            orbitControls: null as any,
            model: null as null | SculptureGroup,
            startingModel: null as null | SculptureGroup,
        }
    },
    computed: {
        isDev() {
            return import.meta.env.DEV
        },
    },
    watch: {
        "phygital.surfaces.top.polylines": {
            handler() {
                this.updateModelSurface("top")
            },
            immediate: true
        },
        "phygital.surfaces.bottom.polylines": {
            handler() {
                this.updateModelSurface("bottom")
            },
            immediate: true
        },
        "phygital.surfaces.left.polylines": {
            handler() {
                this.updateModelSurface("left")
            },
            immediate: true
        },
        "phygital.surfaces.right.polylines": {
            handler() {
                this.updateModelSurface("right")
            },
            immediate: true
        },
        "phygital.surfaces.front.polylines": {
            handler() {
                this.updateModelSurface("front")
            },
            immediate: true
        },
        "phygital.surfaces.back.polylines": {
            handler() {
                this.updateModelSurface("back")
            },
            immediate: true
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.container.width = this.$el.parentElement.clientWidth
            this.container.height = this.$el.parentElement.clientWidth
            this.define3dEnvironment()
    
            this.updateCanvasSize()
            setTimeout(() => {
                if (this.model) {
                    _.each(this.model.children, surface => {
                        const children = surface.children as Array<THREE.Mesh>
                        _.each(children, part => {
                            if (_.isArray(part.material)) {
                                return
                            }
                            part.material.opacity = 1
                        })
                    })
                }
                this.updateModel()
            })
            if (!this.model) {
                return
            }
        })

        window.addEventListener("phygital:seed", this.phygitalSeedEvent)
        window.addEventListener("resize", this.updateCanvasSize)
    },
    beforeUnmount() {
        window.removeEventListener("phygital:seed", this.phygitalSeedEvent)
        const render = this.renderer as vpg3dRenderer
        if (this.scene) {
            for (let index = this.scene.children.length - 1; index >= 0; index--) {
                const object = this.scene.children[index]
                removeObject(object) // Assuming removeObject is your custom function for additional cleanup
                this.scene.remove(object)
            }
            this.scene = null
        }
        if (this.renderer) {
            this.renderer.dispose()
            this.renderer.forceContextLoss()
            this.renderer.destroyed = true
            cancelAnimationFrame(this.renderer.info.render.frame)

            this.renderer = null
        }

        this.camera = null
        this.orbitControls = null

        // Overwrite model with startingModel to prevent animation from breaking original model
        this.model = this.startingModel
        window.removeEventListener("resize", this.updateCanvasSize)
    },
    methods: {
        phygitalSeedEvent(e : Event) {
            const event = e as phygitalSeedEvent   
            if (event.detail == "prepareChange") {   
                Promise.all([
                    this.fadeOut()
                ]).then(() => {
                    // setTimeout(() => {
                    window.dispatchEvent(new CustomEvent("phygital:seed", {detail: "changed"}))
                    // }, this.app.showAnimations ? 320 : 0) 

                })
            } else if (event.detail == "changed") {  
                setTimeout(() => {
                    if (!this.model) {
                        return
                    }

                    const model = this.sortModel() as Array<THREE.Mesh>
                    this.startingModel = this.model.clone()
                    this.implodeSurfaceAnimation(model)
                })
            }
        },
        define3dEnvironment() {
            const o = threeDView.init({orbitControls: true})
            if (!o) {
                return
            }
            // Update the controls target to the origin point
            this.scene      = o.scene
            this.renderer   = o.renderer
            this.camera     = o.camera
            this.orbitControls = o.orbitControls
            
            if (this.renderer) {
                this.$el.append( this.renderer.domElement )
            }

            if (this.camera) {
                this.camera.position.set(24, 24, -4)
                this.camera.zoom = 1.5
                this.camera.updateProjectionMatrix()
            }

            this.model = new THREE.Group() as SculptureGroup
            this.model.name = "sculpture"
            this.model.width = this.phygital.surfaces.top.width
            this.model.depth = this.phygital.surfaces.top.height
            this.model.height = this.phygital.surfaces.left.height

            this.scene?.add(this.model)
            this.$emit("active:camera", this.camera)
        },
        updateCanvasSize() {
            const el = this.$el.parentElement
            
            let size = el.clientWidth
            if (size < el.clientHeight) {
                size = el.clientHeight
            }
            this.container.width = size
            this.container.height = size

            if (this.renderer) {
                this.renderer.setSize( this.container.width, this.container.height)
            }
        },
        updateModelSurface(surfaceSide: "top" | "bottom" | "left" | "right" |  "front" | "back") {
            if (!this.model) {
                return new Error("updateModelSurface: Missing model")
            }

            this.phygital.update3DModel(this.model, surfaceSide)            
        },
        explodeSurfaceAnimation(lineObjects: Array<THREE.Mesh>) {
            return new Promise(resolve => {
                const promises = [] as Array<Promise<unknown>>
                let delay = 0

                if (this.camera && this.model) {
                    const target = new THREE.Vector3(this.model.width / 2 - 0.75, this.model.height / 2 + 0.5, this.model.depth / 2 - 0.75)

                    gsap.to(this.camera.position, {
                        duration: 2.4, // Duration in seconds
                        x: this.model.width * 2.8,
                        y: this.model.height * 1.6,
                        z: -this.model.height * 2.8,
                        ease: "power1.inOut",
                        onUpdate: () => {
                            if (!this.camera) return
                            this.camera.lookAt(target)
                        },
                    })
                }

                _.each(lineObjects, childObject => {
                    promises.push( new Promise(resolve => {

                        if (!this.model) {
                            return
                        }
                
                        const size = this.model.width*this.model.height*this.model.depth
                        if (size > 220) {
                            delay += .0032
                        } else if (size > 128) {
                            delay += .004
                        } else if (size > 64) {
                            delay += .06
                        } else {
                            delay += .012
                        }
                        
                        childObject.material = childObject.material as THREE.MeshLambertMaterial
                        childObject.material.transparent = true
                        // const material = childObject.material.clone()
                        // material.transparent = true
                        
                        let childAnimation = {
                            delay,
                            duration: 1.28,
                            ease: "power3.inOut"
                        } as {
                            delay: number,
                            duration: number,
                            ease: string,
                            x?: string | number,
                            y?: string | number,
                            z?: string | number,
                        }
                        
                        const surface = childObject.parent
                        if (!surface) {
                            return
                        }

                        if(surface.name.endsWith("top") || surface.name.endsWith("front") ) {
                            childAnimation.y = `+=${Math.random()*1 + .5}`

                        } else if(surface.name.endsWith("bottom") || surface.name.endsWith("back") || surface.name.endsWith("left") || surface.name.endsWith("right")) {
                            childAnimation.y = `-=${Math.random()*1 + .5}`
                        } 


                        gsap.to(childObject.position, {
                            ...childAnimation,
                            // delay: delay + .16,
                        })
                        
                        const opacityAnimation = gsap.to(childObject.material, {
                            duration: 0.4,
                            delay: delay + .16,
                            opacity: 0,
                            onUpdate: () => {
                                const material = childObject.material as THREE.MeshLambertMaterial
                                material.depthWrite = false
                                material.depthTest = false
                                material.transparent = true

                                material.needsUpdate = true
                                material.needsUpdate = true
                            },
                            onComplete: () => {
                                const material = childObject.material as THREE.MeshLambertMaterial
                                material.opacity = 0 // Ensure opacity is set to 0 when animation completes
                                material.needsUpdate = true
                                resolve(true)
                            },
                            ease: "none",
                        })
                    }))
                }) 
                
                Promise.all(promises).then(resolve)
            })
                    
            // side: "top" | "bottom" | "back" | "front" | "left" | "right"
        },
        implodeSurfaceAnimation(lineObjects: Array<THREE.Mesh>) {
            return new Promise(resolve => {
                if (!this.model) {
                    console.warn("implodeSurfaceAnimation: Missing model")
                    return
                }   
                
                this.setCameraToStartPosition()

                const promises = [] as Array<Promise<unknown>>
                let delay = 0
                _.each(lineObjects, childObject => {
                    promises.push( new Promise(resolve => {

                        if (!this.model) {
                            return
                        }
                
                        const size = this.model.width*this.model.height*this.model.depth
                        if (size > 220) {
                            delay += .0064
                        } else if (size > 128) {
                            delay += .008
                        } else if (size > 64) {
                            delay += .012
                        } else {
                            delay += .024
                        }
                        delay = 0.01
                        
                        childObject.material = childObject.material as THREE.MeshLambertMaterial
                        childObject.material.transparent = true
                        // const material = childObject.material.clone()
                        // childObject.material = material as THREE.MeshLambertMaterial
                        
                        let childAnimation = {
                            delay,
                            duration: .96,
                            ease: "power3.out"
                        } as {
                            delay: number,
                            duration: number,
                            ease: string,
                            x?: string | number,
                            // y?: string | number,
                            z?: string | number,
                        }
                        let startPos = "0"
                        
                        const surface = childObject.parent
                        if (!surface) {
                            return
                        }

                        if(surface.name.endsWith("bottom") || surface.name.endsWith("back") ) {
                            startPos = `-=${Math.random()*.32 + .24}`
                            // childAnimation.y = childObject.position.y

                        } else if(surface.name.endsWith("front") || surface.name.endsWith("left") || surface.name.endsWith("right")) {
                            startPos = `+=${Math.random()*.32 + .16}`
                        } else if(surface.name.endsWith("top")) {
                            startPos = `+=${Math.random()*.32 + .32}`
                        } 

                        const endPos = childObject.position.y

                        gsap.set(childObject.position, {
                            y: startPos
                        })

                        gsap.to(childObject.position, {
                            ...childAnimation,
                            y: endPos,
                            // delay: 0,
                        })
                        
                        const opacityAnimation = gsap.to(childObject.material, {
                            ...childAnimation,
                            delay: 0,
                            duration: .24,
                            opacity: 1,
                            onUpdate: () => {
                                const material = childObject.material as THREE.MeshLambertMaterial
                                material.depthWrite = false
                                material.depthTest = false
                                if (material.opacity > .8) {
                                }
                                material.depthWrite = true
                                material.depthTest = true
                                material.transparent = true
                            },
                            onComplete: () => {
                                const material = childObject.material as THREE.MeshLambertMaterial
                                material.opacity = 1 // Ensure opacity is set to 0 when animation completes
                                material.depthWrite = true
                                material.depthTest = true
                                material.transparent = true
                                material.needsUpdate = true
                                resolve(true)
                            },
                            ease: "none",
                        })
                    }))
                }) 
                
                Promise.all(promises).then(resolve)
            })
                    
            // side: "top" | "bottom" | "back" | "front" | "left" | "right"
        },
        updateModel() {

            if (!this.model) {
                console.error("UpdateModel: missing model")
                return
            }

            // Changing this order might cause unexpected behaviour
            this.updateModelSurface("top")
            this.updateModelSurface("bottom")
            this.updateModelSurface("left")
            this.updateModelSurface("right")
            this.updateModelSurface("front")
            this.updateModelSurface("back")
            
            this.startingModel = this.model.clone()
            const model = this.sortModel() as Array<THREE.Mesh>

            this.implodeSurfaceAnimation(model)
            // Animate camera position and lookAt using GSAP
            this.setCameraToStartPosition()
        },
        setCameraToStartPosition() {
            if (!this.camera || !this.model) {
                return
            }

            const target = new THREE.Vector3(this.model.width / 2 - 0.75, this.model.height / 2 + 0.5, this.model.depth / 2 - 0.75)

            // Animate camera position 
            gsap.to(this.camera.position, {
                duration: 1.28, // Duration in seconds
                x: this.model.width * 2.8,
                y: this.model.height * 1.6,
                z: -this.model.height * 2.8,
                ease: "elastic.out(1.01,0.99)",
                onUpdate: () => {
                    if (!this.camera) return

                    this.camera.lookAt(target)
                },
            })

            // Define orientation point for orbitControls
            if (this.orbitControls) {
                this.orbitControls.target =  target
            }
        },
        fadeOut() {
            return new Promise ((resolve, reject) => {

                if (!this.model) {
                    console.error("fadeOut: Missing model")
                    return reject(false)
                }

                if (!this.scene) {
                    console.error("fadeOut: Missing scene")
                    return reject(false)
                }

                // Create array with all the parts
                const surfaces = _.find(this.scene.children, child => {
                    return child.name == "sculpture"
                })

                if (!surfaces) {
                    return reject()
                }

                const surfaceLines = this.sortModel() as Array<THREE.Mesh>
                this.explodeSurfaceAnimation(_.shuffle(surfaceLines))
                    .then(resolve)
            })
        },
        sortModel() {
            if (!this.model) {
                return 
            }
            // Internal helper function for calculating vertical position
            const getPosition = (position: number) => {
                if (!this.model || typeof position === "undefined") {
                    return 0
                }
                return Math.round(((this.model.height - 2) - position ) * 10) / 10 
            }

            // Internal helper function to get angle of Object3D
            const getAngleBetweenPoints = (axis: {x: number, y: number}, point: {x: number, y: number}) => {
                // Calculate the angle in radians
                const angleRadians = Math.atan2(point.y - axis.y, point.x - axis.x)
                const res = angleRadians < 0 ? angleRadians + 2 * Math.PI : angleRadians
                return res /  Math.PI * 180 // Ensure the angle is positive (between 0 and 360)
            }

            // Create partList with vertical position of all objects
            const partList = [] as Array<{position: number, part: THREE.Mesh, angle: number}>
            
            _.each(this.model.children, childObject => {
                if (!this.model) {
                    return
                }

                const surface = childObject.name.replace("surface-", "")
                const axis = {x: this.model.width / 2 + .25, y: this.model.depth / 2 + .25 }
                const children = childObject.children as Array<THREE.Mesh>
                _.each(children, part => {

                    // Calculate boundingSphere when THREE.JS has not done that in time
                    if (!part.geometry.boundingSphere) {
                        part.geometry.computeBoundingSphere()
                    }

                    if (!part.geometry || !part.geometry.boundingSphere) {
                        return
                    }
                    const newPart = {
                        part,
                        position: getPosition(part.geometry.boundingSphere.center.z),
                        angle: getAngleBetweenPoints(axis, {x: part.geometry.boundingSphere.center.x, y:part.geometry.boundingSphere.center.y})
                    }
                    if (!this.model) {
                        return
                    }
                    
                    
                    if (surface == "top") {
                        newPart.position = this.model.height - 1
                    } else if (surface == "bottom") {
                        newPart.position = 0
                    } else if (surface == "left") {
                        newPart.angle = 0
                    } else if (surface == "right") {
                        newPart.angle = 180
                    } else if (surface == "front") {
                        newPart.angle = 90
                    } else if (surface == "back") {
                        newPart.angle = 270
                        
                    } 
                    partList.push(newPart)
                })
            })
            
            
            return _.map(_.sortBy(partList, ["position", "angle"]), "part")
        },
        cancelCameraAnimation() {
            if (!this.camera) return
            gsap.killTweensOf(this.camera.position)
            gsap.killTweensOf(this.camera.lookAt)
        }
    }

}
</script>

<style lang="scss" >
@import "@/assets/scss/variables.scss";
.sandbox-view {
    width: 100%;
    height: 100%;
    color: $black;
    font-size: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 100%;
    max-width: 100%;
    position: relative;

    canvas {
        max-width: 100%;
        max-height: 100%;
        aspect-ratio: 1/1;
        width: auto !important;
        height: auto !important;
    }
}
</style>