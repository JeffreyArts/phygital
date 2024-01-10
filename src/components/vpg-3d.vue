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

interface Pattern3D extends THREE.Object3D {
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
            pattern3D: new THREE.Object3D() as Pattern3D,
            orbitControls: null as any,
            updateTimeout: 0 as Timeout,
            model: null as null | THREE.Group
        }
    },
    watch: {
        // "modelChanged": {
        //     handler(val, oldVal) {
        //         this.updateModel()
        //     },
        // },
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
        console.log("vpg 3D mounted", this.phygital.surfaces.top.polylines.length, this.model)

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
                    this.hideSculpture()
                ]).then(() => {

                    // if (this.camera) {
                    //     this.camera.position.set(20, 8, -2)
                    //     this.camera.zoom = 1.5
                    //     this.camera.updateProjectionMatrix()
                    // }
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
            this.model = new THREE.Group()
            this.model.name = "sculpture"
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
            // console.log("model",this.model)
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
            // console.log("UPDATE 3D SURFACE",surface.polylines, pattern3D)
            const mergedObject = new THREE.Group()


            _.each(pattern3D, (mesh: any, i:number) => {
                mesh.name = `${surfaceSide}-${i}`
                mergedObject.add(mesh)
            })
              
            // for (let i = 1; i < pattern3D.length; i++) {
            //     mergedObject = CSG.toMesh(CSG.fromMesh(mergedObject).union(CSG.fromMesh(pattern3D[i])), mergedObject.matrix)
            // }
            
            

            
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
            // mergedObject.name = `${mergedObject.name}-${Math.ceil(Math.random()*1000)}`
            // surfaces[surfaceSide].update3D++
        },
        hideSculpture() {
            return new Promise ((resolve, reject) => {

                if (!this.model) {
                    console.error("hideSculpture: Missing model")
                    return reject(false)
                }
                
                if (!this.scene) {
                    console.error("hideSculpture: Missing scene")
                    return reject(false)
                }
                
                // Create array with all the parts
                let surfaceLines = [] as Array<any>
                const surfaces = _.find(this.scene.children, child => {
                    return child.name == "sculpture"
                })
                    
                if (surfaces && surfaces.children.length > 0) {
                    _.each(surfaces.children, surface => {
                        _.each(surface.children, (child) => {
                            if (!(child instanceof THREE.Mesh)) {
                                return
                            }
                            
                            child.material.transparent = true
                                
                            const material = child.material.clone()
                            child.material = material
                            surfaceLines.push(child)
                        })
                    })                
                }

                // surfaceObjects = _.shuffle(surfaceObjects).sort((a,b) => {
                //     return a.position.z - b.position.z
                // })

                // const timeline = gsap.timeline({
                //     onComplete: () => {
                //         if (!this.camera) {
                //             console.error("hideSculpture: Missing camera")
                //             return reject(false)
                //         }

                //         this.camera.position.set(20, 8, -2)
                //         this.camera.zoom = 1.5
                //         this.camera.updateProjectionMatrix()
                //         // this.updateSurfaces()
                        
                //         // this.appState = "DeActive"
                //         // window.dispatchEvent(new CustomEvent(`appState:${this.name}`, { detail: "deActivated" }))
                //         // this.updatePattern ++



                //         // this.phygital.update3DSurface(surface)
                //         // this.phygital.update3DSurface(oppositeSurface)
                //         // return resolve(true)
                //     }
                // })
                const promises = [] as Array<Promise<unknown>>
                if (surfaces) {
                    _.each(surfaces.children, (childObject) => {
                        const surface = childObject as THREE.Group
                        promises.push(this.explodeSurfaceAnimation(surface))
                    })
                }

                Promise.all(promises).then(resolve)
                
                // // Animate parts    
                // _.each(surfaceObjects, (object, i) => {
                //     let newPos = (object.name.startsWith("top") || object.name.startsWith("front")) ? object.position.y + 1 : object.position.y - 1
                //     const positionAnimation = gsap.to(object.position, {
                //         duration: 0.8,
                //         y: newPos,
                //         ease: "power4.out",
                //         delay: i * .008
                //     })
                    
                    
                //     const opacityAnimation = gsap.to(object.material, {
                //         duration: 0.4,
                //         delay: i*.008,
                //         opacity: 0,
                //         onUpdate: () => {
                //             object.material.needsUpdate = true
                //         },
                //         onComplete: () => {
                //             object.material.opacity = 0 // Ensure opacity is set to 0 when animation completes
                //             object.material.needsUpdate = true
                //         },
                //         ease: "none",
                //     })

                //     timeline.add(positionAnimation, i * 0.01)
                //     timeline.add(opacityAnimation, i * 0.02)
                // })
                // timeline.play()

                
                    
                // Animate camera
                // gsap.to(this.camera, {
                //     duration: 1.8,
                //     zoom: 1,
                //     onUpdate: () => {
                //         if (!this.camera) {
                //             return
                //         }
                //         this.camera.updateProjectionMatrix()
                //     },
                
                //     ease: "power2.out",
                // })
            })
        },
        explodeSurfaceAnimation(surface: THREE.Group) {
            return new Promise(resolve => {
                const baseAnimation = {
                    duration: .96,
                    ease: "power1.out",
                    delay: 0
                }
                let animation = {
                    ...baseAnimation
                } as {
                duration: number,
                ease: string,
                delay: number
                x?: string | number,
                y?: string | number,
                z?: string | number,
            }
            
                if (surface.name.endsWith("top")) {
                    animation.y = "+=.8"
                } else if(surface.name.endsWith("bottom")) {
                    animation.delay = 0.48
                    animation.y = "-=.8"
                } else if (surface.name.endsWith("front")) {
                    animation.delay = .16
                    animation.z = "+=.8"
                } else if(surface.name.endsWith("back")) {
                    animation.delay = .8
                    animation.z = "-=.8"
                } else if (surface.name.endsWith("left")) {
                    animation.delay = 0.64
                    animation.x = "-=.8"
                } else if(surface.name.endsWith("right")) {
                    animation.delay = 0.32
                    animation.x = "+=.8"
                }

                gsap.to(surface.position,animation)

                _.each(surface.children, childObject => {
                    const material = childObject.material
                    material.transparent = true
                    const opacityAnimation = gsap.to(material, {
                        duration: 0.4,
                        delay: animation.delay + .08,
                        opacity: 0,
                        onUpdate: () => {
                            material.needsUpdate = true
                        },
                        onComplete: () => {
                            material.opacity = 0 // Ensure opacity is set to 0 when animation completes
                            material.needsUpdate = true
                            resolve(true)
                        },
                        ease: "none",
                    })
                })
            })
                    
            // side: "top" | "bottom" | "back" | "front" | "left" | "right"
        },
        updateModel() {
            console.log("updateModel method", this.phygital)

            // Changing this order might cause unexpected behaviour
            this.updateModelSurface("top")
            this.updateModelSurface("bottom")
            this.updateModelSurface("left")
            this.updateModelSurface("right")
            this.updateModelSurface("front")
            this.updateModelSurface("back")

            this.fadeIn()
            // if (this.datamodel.children.length <= 0){
            //     return // Can not update model if there is no model
            // }
            
            // if (!this.camera) return
            // if (!this.scene) return
            
            // this.updateCanvasSize()
            // console.log("Model updated")


            // // _.each(this.scene.children, childObject => {
            // //     if (childObject.name == "datamodel") {
            // //         this.removeObject(childObject)
            // //     }
            // // })

            // if (this.datamodel && this.datamodel.uuid) {
            //     const internalDatamodel = this.datamodel.clone()
            //     internalDatamodel.name = "datamodel"
            //     this.scene.add(internalDatamodel)
            // }

            // // Calculate the target position
            // const target = new THREE.Vector3(this.datamodel.width / 2 - 0.75, this.datamodel.height / 2 + 0.5, this.datamodel.depth / 2 - 0.75)

            // if (this.orbitControls) {
            //     this.orbitControls.target =  target
            // }
        },
        fadeOut() {
            this.hideSculpture()
            // clearTimeout(this.updateTimeout)
            // _.remove(this.pattern3D.children, childObject => {
            //     console.log("childObject", childObject.name,childObject.children.length, childObject.children)
            //     if (childObject.name == "innerCube") {
            //         removeObject(childObject)
            //         return true
            //     }
            //     if (childObject.name.startsWith("face")) {
            //         removeObject(childObject)
            //         return true
            //     }
            // })
            
            // _.each(this.cube, side => {
            //     removeObject(side)
            // })
            
            // this.updateTimeout = setTimeout(() => {
            //     this.appState = "DeActive"
            //     window.dispatchEvent(new CustomEvent(`appState:${this.name}`, { detail: "deActivated" }))
            //     this.updatePattern ++
            // }, 100)

            
        },
        fadeIn() { 
            clearTimeout(this.updateTimeout)
            if (!this.camera) {
                return
            }
            // this.appState = "Fading In"
            // Define Genetal meta data
            this.pattern3D.name = Math.floor(Math.random()*1000) + ""
            this.pattern3D.width = this.phygital.surfaces.top.width
            this.pattern3D.depth = this.phygital.surfaces.top.height
            this.pattern3D.height = this.phygital.surfaces.left.height

            // No support for this feature
            // if (!this.phygital.openCube) {
            //     const box = new THREE.BoxGeometry(this.pattern3D.width-1.5, this.pattern3D.height-1.5, this.pattern3D.depth-1.5)
            //     if (this.phygital.surfaces.top.model3D) {
            //         const mesh = new THREE.Mesh(box, this.phygital.surfaces.top.model3D.material)
            //         mesh.name = "innerCube"
            //         mesh.position.set((this.pattern3D.width-1.5)/2, (this.pattern3D.height-1.5)/2 + 1.25, (this.pattern3D.depth-1.5)/2)
            //         this.pattern3D.add(mesh)   
            //     }
            // }

            
            const target = new THREE.Vector3(this.pattern3D.width / 2 - 0.75, this.pattern3D.height / 2 + 0.5, this.pattern3D.depth / 2 - 0.75)

            // Animate camera position and lookAt using GSAP
            gsap.to(this.camera.position, {
                duration: 1.28, // Duration in seconds
                x: this.pattern3D.width * 2.8,
                y: this.pattern3D.height * 1.6,
                z: this.pattern3D.height * 2.8,
                ease: "power1.inOut",
                onComplete: () => {
                    // window.dispatchEvent(new CustomEvent(`appState:${this.name}`, { detail: "activated" }))
                    // this.updatePattern ++
                    // this.appState = "Active"
                },
            })

            if (this.orbitControls) {
                this.orbitControls.target =  target
            }
            this.camera.lookAt(target.x, target.y, target.z)

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
            
            
            this.updateTimeout = setTimeout(() => {
                
                //
            }, 100)
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