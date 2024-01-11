<template>
    <div class="sandbox-view" @mousedown="cancelAnimations"></div>
</template>

<script lang="ts">
import _ from "lodash"
import * as THREE from "three"
import gsap from "gsap" 
import Phygital from "@/stores/phygital"
import AppStore from "@/stores/app"

import { phygitalSeedEvent, Surface } from "@/stores/phygital"
import { vpg3dRenderer } from "@/services/3d-view.js"

import threeDView from "@/services/3d-view.js"
import polylinesToThreejs from "@/services/polylines-to-threejs"
import removeObject from "@/services/threejs-remove-object"

interface SculptureGroup extends THREE.Group {
  height: number;
  width: number;
  depth: number;
}



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
            model: null as null | SculptureGroup
        }
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
        }
    },
    mounted() {
        this.container.width = this.$el.parentElement.clientWidth
        this.container.height = this.$el.parentElement.clientWidth
        this.define3dEnvironment()

        this.updateCanvasSize()
        this.updateModel()

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

        window.removeEventListener("resize", this.updateCanvasSize)
    },
    methods: {

        phygitalSeedEvent(e : Event) {
            const event = e as phygitalSeedEvent   
            
            if (event.detail == "prepareChange") {   
                Promise.all([
                    this.fadeOut()
                ]).then(() => {
                    setTimeout(() => {
                        window.dispatchEvent(new CustomEvent("phygital:seed", {detail: "changed"}))
                    }, 320)

                })
            }
        },
        define3dEnvironment() {
            const o = threeDView.init({orbitControls: true})
            // Update the controls target to the origin point
            this.scene      = o.scene
            this.renderer   = o.renderer
            this.camera     = o.camera
            this.orbitControls = o.orbitControls
            
            if (this.renderer) {
                this.$el.append( this.renderer.domElement )
            }
            
            if (this.camera) {
                this.camera.position.set(20, 8, -2)
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

            const diameter = .5
            const surfaces = this.phygital.surfaces
            const surface = this.phygital.surfaces[surfaceSide]
            const pattern3D = polylinesToThreejs(surface.polylines, {
                width: surface.width,
                height: surface.height,
                type: "box",
                diameter: diameter,
                beamWidth: diameter,
                beamHeight: diameter,
                tube: false,
                color: "#777",
                tubeThickness: .0125,
            })
            const mergedObject = new THREE.Group()


            _.each(pattern3D, (mesh: any, i:number) => {
                mesh.name = `${surfaceSide}-${i}`
                mergedObject.add(mesh)
            })
            
            if (surfaceSide === "top") {
                // mergedObject.material = pattern3D[0].material
                // mergedObject.material = new THREE.MeshLambertMaterial( { color: "#f00" })
                mergedObject.name = "surface-top"
                mergedObject.position.z = - diameter/2
                mergedObject.position.x = - diameter/2
                mergedObject.position.y = surfaces.left.height - diameter/2
                
                _.each(this.model.children, g => {
                    const group = g as THREE.Group
                    if (group?.name == "surface-top") {
                        removeObject(group)
                        this.model?.remove(g)
                        return true
                    }
                    return false
                })
                this.model.add(mergedObject)
            }
            if (surfaceSide === "bottom") {
                // mergedObject.material = pattern3D[0].material
                // mergedObject.material = new THREE.MeshLambertMaterial( { color: "#ff0" })
                mergedObject.name = "surface-bottom"
                mergedObject.position.z = - diameter/2 
                mergedObject.position.x = - diameter/2 
                mergedObject.position.y = 1 - diameter/2 
                mergedObject.updateMatrix()
                
                _.each(this.model.children, g => {
                    const group = g as THREE.Group
                    if (group?.name == mergedObject.name) {
                        removeObject(group)
                        this.model?.remove(g)
                        return true
                    }
                    return false
                })
                this.model.add(mergedObject)
            }
            
            if (surfaceSide === "front") {
                // mergedObject.material = pattern3D[0].material
                // mergedObject.material = new THREE.MeshLambertMaterial( { color: "#0f0" })
                mergedObject.name = "surface-front"
                mergedObject.rotateX(Math.PI/180* 90)
                mergedObject.position.z = -diameter + surfaces.left.width-1
                mergedObject.position.x = - diameter/2  
                mergedObject.position.y = surface.height
                mergedObject.updateMatrix()
                
                _.each(this.model.children, g => {
                    const group = g as THREE.Group
                    if (group?.name == mergedObject.name) {
                        removeObject(group)
                        this.model?.remove(g)
                        return true
                    }
                    return false
                })
                this.model.add(mergedObject)
            }
            
            if (surfaceSide === "back") {
                // mergedObject.material = pattern3D[0].material
                // mergedObject.material = new THREE.MeshLambertMaterial( { color: "#0ff" })
                mergedObject.name = "surface-back"
                mergedObject.rotateX(Math.PI/180* 90)
                mergedObject.position.z = -diameter
                mergedObject.position.x = -diameter/2
                mergedObject.position.y = surface.height
                mergedObject.updateMatrix()
                
                _.each(this.model.children, g => {
                    const group = g as THREE.Group
                    if (group?.name == mergedObject.name) {
                        removeObject(group)
                        this.model?.remove(g)
                        return true
                    }
                    return false
                })
                this.model.add(mergedObject)
            }

            if (surfaceSide === "left") {
                // mergedObject.material = pattern3D[0].material
                // mergedObject.material = new THREE.MeshLambertMaterial( { color: "#00f" })
                mergedObject.name = "surface-left"
                mergedObject.rotateY(Math.PI/180* 180)
                mergedObject.rotateX(Math.PI/180* 90)
                mergedObject.rotateZ(Math.PI/180* 90)
                // mergedObject.rotateZ(Math.PI/180* 90)
                mergedObject.position.z = -diameter/2 +  surface.width - 1
                mergedObject.position.x = - diameter
                mergedObject.position.y = surface.height
                mergedObject.updateMatrix()
                
                _.each(this.model.children, g => {
                    const group = g as THREE.Group
                    if (group?.name == mergedObject.name) {
                        removeObject(group)
                        this.model?.remove(g)
                        return true
                    }
                    return false
                })
                this.model.add(mergedObject)
            }
            
            if (surfaceSide === "right") {
                // mergedObject.material = pattern3D[0].material
                // mergedObject.material = new THREE.MeshLambertMaterial( { color: "#f0f" })
                mergedObject.name = "surface-right"
                mergedObject.rotateX(Math.PI/180* 90)
                mergedObject.rotateZ(Math.PI/180* 90)
                mergedObject.position.z = - diameter/2 
                mergedObject.position.x = surfaces.front.width - 1
                mergedObject.position.y = surface.height
                mergedObject.updateMatrix()
                
                _.each(this.model.children, g => {
                    const group = g as THREE.Group
                    if (group?.name == mergedObject.name) {
                        removeObject(group)
                        this.model?.remove(g)
                        return true
                    }
                    return false
                })
                this.model.add(mergedObject)
            }
        },
        explodeSurfaceAnimation(lineObjects: Array<THREE.Mesh>) {
            return new Promise(resolve => {
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
                        
                        const material = childObject.material.clone()
                        material.transparent = true
                        childObject.material = material as THREE.MeshLambertMaterial
                        
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
        updateModel() {
            // Changing this order might cause unexpected behaviour
            this.updateModelSurface("top")
            this.updateModelSurface("bottom")
            this.updateModelSurface("left")
            this.updateModelSurface("right")
            this.updateModelSurface("front")
            this.updateModelSurface("back")

            this.fadeIn()
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
                z: this.model.height * 2.8,
                ease: "power1.inOut",
            })

            // Animate orientation point of camera
            gsap.to(this.camera.lookAt, {
                duration: 1.28,
                x: target.x,
                y: target.y,
                z: target.z,
                onUpdate: () => {
                    if (!this.camera) return

                    this.camera.lookAt(target)
                },
                ease: "power1.inOut",
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
                this.setCameraToStartPosition()
                if (!surfaces) {
                    return reject()
                }

                const surfaceLines = [] as Array<THREE.Mesh>
                _.each(surfaces.children, surface => {
                    _.each(surface.children, c => {
                        const childObject = c as THREE.Mesh
                        surfaceLines.push(childObject)
                    })
                })
                this.explodeSurfaceAnimation(_.shuffle(surfaceLines))
                    .then(resolve)
            })
        },
        fadeIn() { 
            if (!this.camera) {
                return
            }

            // No support for this feature
            // if (!this.phygital.openCube) {
            //     const box = new THREE.BoxGeometry(this.model.width-1.5, this.model.height-1.5, this.model.depth-1.5)
            //     if (this.phygital.surfaces.top.model3D) {
            //         const mesh = new THREE.Mesh(box, this.phygital.surfaces.top.model3D.material)
            //         mesh.name = "innerCube"
            //         mesh.position.set((this.model.width-1.5)/2, (this.model.height-1.5)/2 + 1.25, (this.model.depth-1.5)/2)
            //         this.model.add(mesh)   
            //     }
            // }

            // Animate camera position and lookAt using GSAP
            this.setCameraToStartPosition()
        },
        cancelAnimations() {
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