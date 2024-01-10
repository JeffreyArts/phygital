import { defineStore, Store } from "pinia"
import { Algorithm } from "visual-pattern-generator"
import shuffleSeed from "@/services/shuffle-seed"
import _ from "lodash"
import { saveAs } from "file-saver"
import * as exportSTL  from "threejs-export-stl"

export type Surface = {
  mirrorX: 0 | 1 | 2;
  mirrorY: 0 | 1 | 2;
  width: number;
  height: number;
  polylines: Array<Array<{x:number, y:number}>>;
}

export interface phygitalSeedEvent extends Event {
    detail: "prepareChange" | "changed" 
}

window.addEventListener("phygital:seed", (e : Event) => {
    const event = e as phygitalSeedEvent
    if (event.detail == "changed") {
        PhygitalStore().updateSurfaces()
        PhygitalStore().generatingSeed = false
    }
})

export const PhygitalStore = defineStore({
    id: "phygital",
    state: () => ({
        surfaces: {
            top: {
                mirrorX: 0,
                mirrorY: 0,
                width: 3,
                height: 3,
                polylines: [],
            },
            bottom: {
                mirrorX: 0,
                mirrorY: 0,
                width: 3,
                height: 3,
                polylines: [],
            },
            left: {
                mirrorX: 0,
                mirrorY: 0,
                width: 3,
                height: 7,
                polylines: [],
            },
            right: {
                mirrorX: 0,
                mirrorY: 0,
                width: 3,
                height: 7,
                polylines: [],
            },
            front: {
                mirrorX: 0,
                mirrorY: 0,
                width: 3,
                height: 7,
                polylines: [],
            },
            back: {
                mirrorX: 0,
                mirrorY: 0,
                width: 3,
                height: 7,
                polylines: [],
            }
        } as {
          top: Surface,
          bottom: Surface,
          left: Surface,
          right: Surface,
          back: Surface,
          front: Surface,
        },
        seed: "",
        originalSeed: "",
        generatingSeed: false,
        blockSize: 4,
    }),
    actions: {
        setSeed(seed:string) {
            this.seed = seed
            this.originalSeed = seed
            this.updateSurfaces()
        },
        updateSeed(seed:string) {
            this.seed = seed
            this.originalSeed = seed
            this.generatingSeed = true
            window.dispatchEvent(new CustomEvent("phygital:seed", { detail: "prepareChange" }))
        
        },
        updateSurfaces() {
            return new Promise ((resolve, reject) => {
                    
                if (!this.seed) {
                    return reject(new Error("No seed"))
                }

                
                const surfaces = ["top","left","front"] as Array<"top" | "left" | "front">
                
                // Define config for generating pattern (changing this will destroy validation of seeds)
                const vpgBaseOptions = {
                    symbols: [
                        {
                            polylines: [
                                [ {x:0, y:0},{ x:1, y:0} ]
                            ],
                            connectCords: [
                                { x:0, y:0 },
                                { x:1, y:0 }
                            ],
                            width:2,
                            height:1
                        },
                        {
                            polylines: [
                                [ {x:0, y:0},{ x:0, y:1} ]
                            ],
                            connectCords: [
                                { x:0, y:0 },
                                { x:0, y:1 }
                            ],
                            width:1,
                            height:2
                        },
                    ],
                    width: 1,
                    height: 1,
                    seed: "",
                    algorithm: {
                        type: "polylines",
                        startPoint: {x:0, y:0},
                        mirrorX: 1,
                        mirrorY: 1,
                        drawConnectLines: true,
                    }
                }

                
                
                const promises = [] as Array<Promise<any>>
                _.forEach(surfaces, (surface, index) => {
                
                    // Set mirror options
                    const mirroringOptionValues = ["11"] //first digit is boolean for mirrorX, second digit is boolean for mirrorY
                    if (surface === "left") {
                        mirroringOptionValues.push("10")
                    }
                    if (surface === "front") {
                        mirroringOptionValues.push("10")
                    }
                    const mirroringOptions = shuffleSeed(mirroringOptionValues, this.seed)
                    const mirroringOption = mirroringOptions[0]
                    
                    
                    // Set starting points
                    const startPoints = []
                    for (let x = 0; x < this.surfaces[surface].width/2; x++) {
                        for (let y = 0; y < this.surfaces[surface].height/2; y++) {
                            startPoints.push({x,y})
                        }
                    }
                    const startPointsFiltered = shuffleSeed(startPoints, this.seed)
                    const startPoint = startPointsFiltered[index % startPointsFiltered.length]
                    
                    const vpgOptions = _.cloneDeep(vpgBaseOptions)

                    let seedOffset = "" as string
                    if (surface === "top") { 
                        seedOffset = ".A"
                    } else if (surface === "left") {
                        seedOffset = ".B"
                    } else if (surface === "front") {
                        seedOffset = ".C"
                    }
                        
                    vpgOptions.seed = this.seed+"-"+seedOffset
                    vpgOptions.width = this.surfaces[surface].width
                    vpgOptions.height = this.surfaces[surface].height
                    vpgOptions.algorithm.mirrorX = parseInt(mirroringOption[0], 10)
                    vpgOptions.algorithm.mirrorY = parseInt(mirroringOption[1], 10)
                    vpgOptions.algorithm.startPoint = startPoint

                    promises.push(this.generatePolylines(vpgOptions))
                })

                Promise.all(promises).then((polylines) => {
                    _.each(surfaces, (surface, index) => {
                        const oppositeSurface = this.getOppositeSurface(surface)
                        if (!oppositeSurface) {
                            return
                        }
                        this.surfaces[surface].polylines = polylines[index]

                        this.surfaces[oppositeSurface].polylines = _.sortBy(_.cloneDeep(this.surfaces[surface].polylines), ["y", "x"])
                    })

                    window.dispatchEvent(new CustomEvent("phygital:update"))
                    resolve(true)
                })
                
            })
        },
        async generatePolylines(vpgOptions: any) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(Algorithm(vpgOptions).polylines)
                }, 0)
                    
            })
        },
        addLine(newLine: Array<{x: number, y:number}>, surface: "top" | "bottom" | "left" | "right" | "front" | "back") {
            this.surfaces[surface].polylines.push(newLine)
            this.seed = "custom"
        },
        removeLine(newLine: Array<{x: number, y:number}>, surface: "top" | "bottom" | "left" | "right" | "front" | "back") {
            this.surfaces[surface].polylines.push(newLine)
            this.seed = "custom"
        },
        getOppositeSurface(surface: "top" | "bottom" | "left" | "right" |  "front" | "back") {
            if (surface == "top") {
                return "bottom"
            } else if (surface == "bottom") {
                return "top"
            } else if (surface == "left") {
                return "right"
            } else if (surface == "right") {
                return "left"
            } else if (surface == "front") {
                return "back"
            } else if (surface == "back") {
                return "front"
            } else {
                console.error("getOppositeSurface: Invalid input")
            }
        },
        downloadSTL(filename: string) { 
            return new Promise((resolve, reject)=> {       
                let mergedObject = null as null | THREE.Mesh | THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>>
                
                _.each(this.surfaces, (surface) => {
                    if (!_.isNull(surface.model3D)) {
                        surface.model3D.updateMatrix()
                        _.each(surface.model3D.children, (child) => {
                            const newMesh = child.clone() as THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>>
                            if (!surface.model3D) {
                                return
                            }
                            
                            newMesh.position.x += surface.model3D.position.x
                            newMesh.position.y += surface.model3D.position.y
                            newMesh.position.z += surface.model3D.position.z

                            newMesh.rotateX(surface.model3D.rotation.x)
                            newMesh.rotateY(surface.model3D.rotation.y)
                            newMesh.rotateZ(surface.model3D.rotation.z)

                            newMesh.updateMatrix()


                            if (!mergedObject) {
                                mergedObject = newMesh
                                return
                            }
                            if (newMesh)
                                mergedObject.updateMatrix()
                            mergedObject = CSG.toMesh(CSG.fromMesh(mergedObject).union(CSG.fromMesh(newMesh)), mergedObject.matrix)
                        })
                    }
                })
                
                if (!mergedObject) {
                    console.error("No object available")
                    return new Error("noObjectAvailable")
                }
            
                const buffer = exportSTL.fromMesh(mergedObject)
                const blob = new Blob([buffer], { type: exportSTL.mimeType })

                saveAs(blob, `${filename}.stl`)
                return resolve(blob)
            })
        },
    },
    getters: {
    }
})

export default PhygitalStore