import {Algorithm, Grid, Polyline} from "visual-pattern-generator"
import _  from "lodash"
import * as THREE from "three"
import { CSG } from "three-csg-ts"

const cutPart = (partlist, pattern, char, options) => {
    if (!options) {
        console.error("Missing required options object", {x:0,y:0,thickness:1})
    }

    if (!options.thickness){
        console.warn("Missing thickness option")
    }
    if (!_.isNumber(options.thickness)){
        console.warn("Invalid thickness option (needs to be a decimal number)")
    }

    var newPart         = false
    var cuttingTool1    = new THREE.Mesh(new THREE.BoxGeometry(3,options.thickness*3, Math.sqrt(2)),  new THREE.MeshLambertMaterial( { color: "#f00" } )) // red
    var cuttingTool2    = new THREE.Mesh(new THREE.BoxGeometry(3,options.thickness*3, Math.sqrt(2)),  new THREE.MeshLambertMaterial( { color: "#00f" } )) // blue
    var cuttingTool3    = new THREE.Mesh(new THREE.BoxGeometry(3,options.thickness*3, Math.sqrt(2)),  new THREE.MeshLambertMaterial( { color: "#000" } )) // orange
    var cuttingTool4    = new THREE.Mesh(new THREE.BoxGeometry(3,options.thickness*3, Math.sqrt(2)),  new THREE.MeshLambertMaterial( { color: "#0f0" } )) // green

    cuttingTool1.position.z = options.y
    cuttingTool1.position.x = options.x + 1
    cuttingTool1.position.y = options.thickness
    cuttingTool1.material.transparent = true
    cuttingTool1.material.opacity = .16
    cuttingTool1.rotateY(Math.PI/180* -45)

    cuttingTool2.position.z = options.y 
    cuttingTool2.position.x = options.x + 1
    cuttingTool2.position.y = options.thickness
    cuttingTool2.material.transparent = true
    cuttingTool2.material.opacity = .16
    cuttingTool2.rotateY(Math.PI/180* 45)

    cuttingTool3.position.z = options.y
    cuttingTool3.position.x = options.x - 1
    cuttingTool3.position.y = options.thickness
    cuttingTool3.material.transparent = true
    cuttingTool3.material.opacity = .16
    cuttingTool3.rotateY(Math.PI/180* 45)

    cuttingTool4.position.z = options.y 
    cuttingTool4.position.x = options.x - 1
    cuttingTool4.position.y = options.thickness
    cuttingTool4.material.transparent = true
    cuttingTool4.material.opacity = .16
    cuttingTool4.rotateY(Math.PI/180* -45)

    cuttingTool1.updateMatrix()
    cuttingTool2.updateMatrix()
    cuttingTool3.updateMatrix()
    cuttingTool4.updateMatrix()

    if (char == "└" || char == "┘" || char == "┌" || char == "┐" || char == "┬" || char == "┴" || char == "┤" || char == "├" || char == "┼") {
    } else {
        return
    }


    _.each(pattern, (polyline, index) => {
        var orientation = "vert"
        var found = _.find(polyline, (cord, index) => {
            if (cord.x == options.x && cord.y == options.y) {
                if (
                    (polyline[index + 1] && polyline[index + 1].y == polyline[index].y) ||
                    (polyline[index - 1] && polyline[index - 1].y == polyline[index].y)
                ) {
                    orientation = "hor"
                }
                return true
            }
        })

        if (!found) {return}

        var threeObject = _.find(partlist, part => {
            if (part.polylineIndex == index) {
                return part
            }
        })

        if (!threeObject) {
            return
        }

        threeObject.updateMatrix()


        if (char == "┌") {
            if (orientation == "vert") {
                newPart = CSG.subtract(threeObject, cuttingTool1)
            } else {
                newPart = CSG.subtract(threeObject, cuttingTool4)
            }
        } else if (char == "┐") {
            if (orientation == "vert") {
                newPart = CSG.subtract(threeObject, cuttingTool3)
            } else {
                newPart = CSG.subtract(threeObject, cuttingTool2)
            }
        } else if (char == "└") {
            if (orientation == "vert") {
                newPart = CSG.subtract(threeObject, cuttingTool2)
            } else {
                newPart = CSG.subtract(threeObject, cuttingTool3)
            }
        } else if (char == "┘") {
            if (orientation == "vert") {
                newPart = CSG.subtract(threeObject, cuttingTool4)
            } else {
                newPart = CSG.subtract(threeObject, cuttingTool1)
            }
        } else if (
            char == "┴" ||
            char == "┬" ||
            char == "┤" ||
            char == "├" ||
            char == "┼"
        ) {

            if (orientation == "vert") {
                var other = null
                var self = null
                var polylines = Polyline.getLinesAtPoint(options.x,options.y,pattern)
                _.each(polylines, polyline => {
                    if (polyline.line[0].x == polyline.line[1].x) {
                        if (polyline.index != index) {
                            other = _.reduce(pattern[polyline.index], (res, val) => res.y + val.y)
                            self = _.reduce(pattern[index], (res, val) => res.y + val.y)
                        }
                    }
                })

                if (char == "┬") {
                    newPart = CSG.toMesh(CSG.fromMesh(threeObject).subtract(CSG.fromMesh(cuttingTool3)), threeObject.matrix)
                    newPart.updateMatrix()
                    newPart = CSG.toMesh(CSG.fromMesh(newPart).subtract(CSG.fromMesh(cuttingTool1)), newPart.matrix)
                } else if (char == "┴") {
                    newPart = CSG.toMesh(CSG.fromMesh(threeObject).subtract(CSG.fromMesh(cuttingTool4)), threeObject.matrix)
                    newPart.updateMatrix()
                    newPart = CSG.toMesh(CSG.fromMesh(newPart).subtract(CSG.fromMesh(cuttingTool2)), newPart.matrix)
                } else if (char == "├") {
                    if (self < other) {
                        // Top
                        newPart = CSG.toMesh(CSG.fromMesh(threeObject).subtract(CSG.fromMesh(cuttingTool4)), threeObject.matrix)
                        newPart.updateMatrix()
                        newPart = CSG.toMesh(CSG.fromMesh(newPart).subtract(CSG.fromMesh(cuttingTool2)), newPart.matrix)
                    } else {
                        // Bottom
                        newPart = CSG.toMesh(CSG.fromMesh(threeObject).subtract(CSG.fromMesh(cuttingTool1)), threeObject.matrix)
                    }
                } else if (char == "┤") {
                    if (self < other) {
                        // Top
                        newPart = CSG.toMesh(CSG.fromMesh(threeObject).subtract(CSG.fromMesh(cuttingTool4)), threeObject.matrix)
                        newPart.updateMatrix()
                        newPart = CSG.toMesh(CSG.fromMesh(newPart).subtract(CSG.fromMesh(cuttingTool2)), newPart.matrix)
                    } else {
                        // Bottom
                        newPart = CSG.toMesh(CSG.fromMesh(threeObject).subtract(CSG.fromMesh(cuttingTool3)), threeObject.matrix)
                    }
                } else if (char == "┼") {
                    if (self < other) {
                        // Top
                        newPart = CSG.toMesh(CSG.fromMesh(threeObject).subtract(CSG.fromMesh(cuttingTool2)), threeObject.matrix)
                        newPart.updateMatrix()
                        newPart = CSG.toMesh(CSG.fromMesh(newPart).subtract(CSG.fromMesh(cuttingTool4)), newPart.matrix)
                    } else {
                        // Bottom
                        newPart = CSG.toMesh(CSG.fromMesh(threeObject).subtract(CSG.fromMesh(cuttingTool3)), threeObject.matrix)
                        newPart.updateMatrix()
                        newPart = CSG.toMesh(CSG.fromMesh(newPart).subtract(CSG.fromMesh(cuttingTool1)), newPart.matrix)
                    }
                }
            } else {
                var other = null
                var self = null
                var polylines = Polyline.getLinesAtPoint(options.x,options.y,pattern)
                _.each(polylines, polyline => {
                    if (polyline.line[0].y == polyline.line[1].y) {
                        if (polyline.index != index) {
                            other = _.reduce(pattern[polyline.index], (res, val) => res.x + val.x)
                            self = _.reduce(pattern[index], (res, val) => res.x + val.x)
                        }
                    }
                })

                if (char == "┬") {
                    if (self < other) {
                        // Left
                        newPart = CSG.toMesh(CSG.fromMesh(threeObject).subtract(CSG.fromMesh(cuttingTool2)), threeObject.matrix)
                    } else {
                        // Right
                        newPart = CSG.toMesh(CSG.fromMesh(threeObject).subtract(CSG.fromMesh(cuttingTool3)), threeObject.matrix)
                        newPart.updateMatrix()
                        newPart = CSG.toMesh(CSG.fromMesh(newPart).subtract(CSG.fromMesh(cuttingTool4)), newPart.matrix)
                    }

                } else if (char == "┴") {
                    if (self < other) {
                        // Left
                        newPart = CSG.toMesh(CSG.fromMesh(threeObject).subtract(CSG.fromMesh(cuttingTool1)), threeObject.matrix)
                    } else {
                        // Right
                        newPart = CSG.toMesh(CSG.fromMesh(threeObject).subtract(CSG.fromMesh(cuttingTool3)), threeObject.matrix)
                        newPart.updateMatrix()
                        newPart = CSG.toMesh(CSG.fromMesh(newPart).subtract(CSG.fromMesh(cuttingTool4)), newPart.matrix)
                    }
                } else if (char == "├") {

                    newPart = CSG.toMesh(CSG.fromMesh(threeObject).subtract(CSG.fromMesh(cuttingTool4)), threeObject.matrix)
                    newPart.updateMatrix()
                    newPart = CSG.toMesh(CSG.fromMesh(newPart).subtract(CSG.fromMesh(cuttingTool3)), newPart.matrix)
                } else if (char == "┤") {
                    newPart = CSG.toMesh(CSG.fromMesh(threeObject).subtract(CSG.fromMesh(cuttingTool1)), threeObject.matrix)
                    newPart.updateMatrix()
                    newPart = CSG.toMesh(CSG.fromMesh(newPart).subtract(CSG.fromMesh(cuttingTool2)), newPart.matrix)
                } else if (char == "┼") {
                    if (self < other) {
                        // Left
                        newPart = CSG.toMesh(CSG.fromMesh(threeObject).subtract(CSG.fromMesh(cuttingTool1)), threeObject.matrix)
                        newPart.updateMatrix()
                        newPart = CSG.toMesh(CSG.fromMesh(newPart).subtract(CSG.fromMesh(cuttingTool2)), newPart.matrix)
                    } else {
                        // Right
                        newPart = CSG.toMesh(CSG.fromMesh(threeObject).subtract(CSG.fromMesh(cuttingTool3)), threeObject.matrix)
                        newPart.updateMatrix()
                        newPart = CSG.toMesh(CSG.fromMesh(newPart).subtract(CSG.fromMesh(cuttingTool4)), newPart.matrix)
                    }
                }
            }
        }


        if (newPart) {
            newPart.material = options.material
            newPart.material.castShadow = true
            newPart.material.receiveShadow = true
            newPart.orientation = orientation
            newPart.polylineIndex = index
            newPart.updateMatrix()
            _.remove(partlist, part => {
                if (part.polylineIndex == index) {
                    return part
                }
            })
            partlist.push (newPart)
        }

    })
}

const mergePattern = (pattern, map) => {
    Grid.loop(map, (x,y) => {
        var current = map[y][x]
        if (current.char == "─") {
            var polylines = Polyline.getLinesAtPoint(x,y,pattern)
            if (polylines.length == 2) {
                var line1 = polylines[0]
                var line2 = polylines[1]
                var line1Min = _.minBy(line1.line, "x")
                var line2Min = _.minBy(line2.line, "x")
                var line1Max = _.maxBy(line1.line, "x")
                var line2Max = _.maxBy(line2.line, "x")

                if (line1Min.x < line2Min.x) {
                    line1Max.x = line2Max.x
                } else {
                    line1Min.x = line2Min.x
                }
                _.remove(pattern, (val,index) => {
                    return index == line2.index
                })
            }
        } else if (current.char == "│") {
            var polylines = Polyline.getLinesAtPoint(x,y,pattern)
            if (polylines.length == 2) {
                var line1 = polylines[0]
                var line2 = polylines[1]
                var line1Min = _.minBy(line1.line, "y")
                var line2Min = _.minBy(line2.line, "y")
                var line1Max = _.maxBy(line1.line, "y")
                var line2Max = _.maxBy(line2.line, "y")

                if (line1Min.y < line2Min.y) {
                    line1Max.y = line2Max.y
                } else {
                    line1Min.y = line2Min.y
                }
                _.remove(pattern, (val,index) => {
                    return index == line2.index
                })
            }
        }
    })
}

const validateGeometryMesh = (mesh, meshes) => {

    const existingMesh = _.find(meshes, (otherMesh) => {
        if (mesh.width == otherMesh.width && mesh.length == otherMesh.length && mesh.height == otherMesh.height) {
            return otherMesh
        }
    })
    if (existingMesh) return existingMesh

    const newMesh = {
        width: mesh.width,
        length: mesh.length,
        height: mesh.height,
        thickness: mesh.thickness,
        geometry: new THREE.BoxGeometry(mesh.width, mesh.length, mesh.height),
        cuttingGeometry: new THREE.BoxGeometry(mesh.width-mesh.thickness, mesh.length, mesh.height-mesh.thickness)
    }
    meshes.push(newMesh)

    return newMesh
}

const patternToThreejsService = (pattern, options = {
    width: 10,
    height: 10,
    tube: false,
    dev: false,
    tubeThickness:0.0125, // tube=true specific
    type: "cylinder",
    beamWidth: .5,      // type=box specific
    beamHeight: .5,     // type=box specific
    segments: 16,       // type=cylinder specific
    diameter: .1        // type=cylinder specific
}) => {
    const type      = _.isUndefined(options.type) ? "cylinder" : options.type
    const parts     = []
    const meshes    = []
    let   radius    = 0

    if (["box", "cylinder"].indexOf(type) == -1) {
        return new Error("Provide correct type ('box' or 'cylinder')")
    }

    if (type == "cylinder") {
        var segments = options.segments || 32
        radius = options.diameter/2 || .5
    }

    if (type == "box") {
        options.beamWidth = options.beamWidth || .5
        options.beamHeight = options.beamHeight || .5
        radius = options.beamWidth
    }

    if (options.tube && !options.tubeThickness){
        options.tubeThickness = radius/10
    }

    if (!options.color){
        options.color = "#333"
    }


    const material  = new THREE.MeshLambertMaterial( { color: options.color })
    const map = Polyline.createMap(pattern, options.width, options.height)
    // _.each(map, row => {
    //     console.log(JSON.stringify(_.map(row, o =>{return o.char})));
    // })

    // mergePattern(pattern, map)
    pattern.forEach((polyline, polylineIndex) => {
        polyline.forEach((cord, ii) => {
            if (ii == 0) {
                return
            }
            var length = 0
            var xOffset = cord.x
            var zOffset = cord.y
            var orientation = "vert"

            if (polyline[ii-1].x == polyline[ii].x) {
                orientation = "hor"

                // Set length
                if (polyline[ii-1].y > polyline[ii].y) {
                    length = polyline[ii-1].y - polyline[ii].y + radius*2
                    zOffset += length/2 - radius
                } else {
                    length = polyline[ii].y - polyline[ii-1].y + radius*2
                    zOffset -= length/2 - radius
                }

                if (type == "cylinder") {
                    var geometry = new THREE.CylinderGeometry(radius, radius , length, segments)
                    var cuttingGeometry = new THREE.CylinderGeometry(radius-options.tubeThickness, radius-options.tubeThickness , length, segments)
                } else if (type == "box") {
                    length -= options.beamWidth
                        
                    const o = validateGeometryMesh({
                        length: length,
                        width: options.beamWidth,
                        height: options.beamHeight,
                        thickness: options.tubeThickness
                    }, meshes)
                    var geometry = o.geometry.clone()
                    var cuttingGeometry = o.cuttingGeometry.clone()
                }
                geometry.rotateX(Math.PI/180*90)
                cuttingGeometry.rotateX(Math.PI/180*90)

            } else if (polyline[ii-1].y == polyline[ii].y) {

                // Set length
                if (polyline[ii-1].x > polyline[ii].x) {
                    length = polyline[ii-1].x - polyline[ii].x + radius*2
                    xOffset += length/2 - radius
                } else {
                    length = polyline[ii].x - polyline[ii-1].x + radius*2
                    xOffset -= length/2 - radius
                }

                if (type == "cylinder") {
                    var geometry = new THREE.CylinderGeometry(radius, radius , length, segments)
                    var cuttingGeometry = new THREE.CylinderGeometry(radius-options.tubeThickness, radius-options.tubeThickness , length, segments)
                } else if (type == "box") {
                    length -= options.beamWidth
                    const o = validateGeometryMesh({
                        length: length,
                        width: options.beamWidth,
                        height: options.beamHeight,
                        thickness: options.tubeThickness
                    }, meshes)
                    var geometry = o.geometry.clone()
                    var cuttingGeometry = o.cuttingGeometry.clone()
                }

                geometry.rotateZ(Math.PI/180*90)
                geometry.rotateX(Math.PI/180*90) // Only required for box type
                cuttingGeometry.rotateZ(Math.PI/180*90)
                cuttingGeometry.rotateX(Math.PI/180*90) // Only required for box type

            } else {
                console.error("Unsupported input", polyline[ii], polyline[ii-1])
            }

            if (type == "box") {
                geometry.translate(xOffset, options.beamHeight/2, zOffset)
                cuttingGeometry.translate(xOffset, options.beamHeight/2, zOffset)
            } else {
                geometry.translate(xOffset, radius, zOffset)
                cuttingGeometry.translate(xOffset, radius, zOffset)
            }

            var newPartMesh = new THREE.Mesh(geometry)
            if (options.tube) {
                var cuttingMesh = new THREE.Mesh(cuttingGeometry)
                cuttingMesh.updateMatrix()
                newPartMesh = CSG.subtract(newPartMesh, cuttingMesh)
            }

            newPartMesh.material = material
            newPartMesh.orientation = orientation
            newPartMesh.polyline = polyline
            newPartMesh.polylineIndex = polylineIndex
            newPartMesh.updateMatrix()

            if (options.dev) {
                newPartMesh.material.transparent = true
                newPartMesh.material.opacity = .64
            } else {
                newPartMesh.castShadow = true
            }


            // // Make 2 box meshes..
            // const meshA = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshNormalMaterial());
            // const meshB = new THREE.Mesh(new THREE.BoxGeometry(1,1,1));
            //
            // meshA.updateMatrix();
            // meshB.updateMatrix();
            //
            // const bspA = CSG.fromMesh(meshA);
            // const bspB = CSG.fromMesh(meshB);
            //
            // // Subtract one bsp from the other via .subtract... other supported modes are .union and .intersect
            // const cube = CSG.toMesh(bspA.union(bspB), meshA.matrix);
            //
            // result = CSG.toMesh(CSG.fromMesh(result).union(CSG.fromMesh(newPartMesh)), result.matrix);

            parts.push(newPartMesh)
            // scene.add(newPartMesh) // Show this only for development purposes
        })
    })

    Grid.loop(map, (x,y) => {
        var obj = map[y][x]
        cutPart(parts, pattern, obj.char, {
            thickness: radius*2,
            x:x,
            y:y,
            material: material
        })
    })
    return parts

}


export default patternToThreejsService