<!-- 
use the .vpg-svg-content for styling the content inside the box. Best way is to style it via the parent component/route that you put this element in.
 -->

 <template>
     <div class="vpg-svg-editable" :class="[
         phygital.editMode ? '__isEditMode' : '',
         '__isBlock'
        ]">
        <figure ref="vpgSVG" @mousedown="onClick" @mousemove="mouseMove"/>
        <svg style="display:none;" id="grid-point-container" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" xml:space="preserve">
            <g class="grid-point" id="grid-point">
                <circle  class="center_ring"  cx="12.5" cy="12.5" r="4"/>
                <circle  class="inner-ring"  cx="12.5" cy="12.5" r="8"/>
                <circle  class="outer-ring"  cx="12.5" cy="12.5" r="12"/>
                <line class="line-horizontal" x1="12.5" y1="8.5" x2="12.5" y2="16.5"/>
                <line class="line-vertical" x1="16.5" y1="12.5" x2="8.5" y2="12.5"/>
            </g>
        </svg>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import { SVG } from "@svgdotjs/svg.js"
import gsap from "gsap"

import DrawSVGPlugin from "gsap/DrawSVGPlugin"
import Phygital from "@/stores/phygital"
import _ from "lodash"


export default defineComponent({
    name: "vpg-svg-editable",
    props: {
        vpgPattern: {
            type: Object,
            required: true,
        },
        updatePattern: {
            type: Number,
            required: false,
        },
    },
    setup() {
        const phygital = Phygital()

        return {
            phygital
        }
    },
    data: () => {
        return {
            svg: SVG(),
            orientation: "portrait" as "portrait" | "landscape",
            cellSize: 0,
            verticalLines: 0,
            horizontalLines: 0,
            removeNewLine: false,
            offset: {x:1, y:1} as {x:number, y:number},
            grid: [] as Array<Array<number>>,
            surfacePolylines: [] as Array<Array<{x:number, y:number}>>,
            newLine: [] as Array<{x:number, y:number}>,
            removableLine: null as null | HTMLElement,
            hoverGridPoint: null as null | HTMLElement,
            removingLine: false,
            surfaceInTransition: false,
            firstLoad: true,
            mouseX: 0,
            mouseY: 0,
            mousePosX: 0,
            mousePosY: 0,
            strokeWidth: 30,
            ignoreAnimation: false,
            newLineEndPos: null as null | {x:number, y:number},
        }
    },
    watch: {
        "updatePattern": {
            // redraw the pattern when the updatePattern prop changes
            handler() {
                this.svg.clear()
                this.defineGrid()
                this.defineSurface()
                this.defineGridPoints()

                this.svg.viewbox(0,0, this.cellSize * this.horizontalLines,  this.cellSize * this.verticalLines)
                this.svg.attr({
                    width: Math.round(this.cellSize * this.horizontalLines),
                    height: Math.round(this.cellSize * this.verticalLines)
                })
            }
        },
        "phygital.editMode": {
            handler(editMode) {
                this.surfaceInTransition = true
                gsap.killTweensOf(".grid-point")
                gsap.killTweensOf(".vpg-line")

                if (editMode) {
                    gsap.to(".grid-point", {
                        opacity: 1,
                        ease: "back.out(3.2)",
                        duration: 0.8,
                        stagger: {
                            grid: [this.horizontalLines, this.verticalLines],
                            each: 24/Math.max(this.horizontalLines, this.verticalLines)/32,
                            from: "edges",
                        }
                    })
                    gsap.to(".vpg-line", {
                        strokeWidth: this.strokeWidth,
                        strokeLinecap: "round",
                        duration: 0.8,
                        ease: "back.out(3.2)",
                        onComplete: () => {
                            this.surfaceInTransition = false
                        }
                    })
                } else {
                    gsap.to(".grid-point", {
                        opacity: 0,
                        duration: 1,
                        stagger: {
                            grid: [this.horizontalLines, this.verticalLines],
                            each: 24/Math.max(this.horizontalLines, this.verticalLines)/32,
                            from: "center"
                        }
                    })
                    gsap.to(".vpg-line", {
                        strokeWidth: Math.round(this.cellSize / 2),
                        strokeLinecap: "square",
                        duration: 1.44,
                        ease: "back.out(1.7)",
                    })
                }
            }
        },
        "vpgPattern.polylines": {
            handler() {
                if (this.vpgPattern.polylines.length == 0) {
                    return
                }
                
                this.surfacePolylines = _.cloneDeep(this.vpgPattern.polylines)
                
                this.surfaceInTransition = true
                const promises = []
                
                if (this.phygital.editMode) {
                    promises.push(this.removeGridPoints(!this.ignoreAnimation))
                }

                if (!this.firstLoad) {
                    promises.push(this.removeSurface(!this.ignoreAnimation))
                }

                Promise.all(promises).then(() => {
                    this.firstLoad = false
                    this.defineGrid()
                    const p1 = this.defineSurface(!this.ignoreAnimation)
                    const p2 = this.defineGridPoints(!this.ignoreAnimation)
                    this.svg.viewbox(0,0, Math.round(this.cellSize * this.horizontalLines),  Math.round(this.cellSize * this.verticalLines))   
                    this.svg.attr({
                        width: Math.round(this.cellSize * this.horizontalLines),
                        height: Math.round(this.cellSize * this.verticalLines)
                    })

                    Promise.all([p1, p2]).then(() => {
                        this.surfaceInTransition = false
                        this.ignoreAnimation = false
                    })
                })
            },
            deep: true
        }
        
    },
    mounted() {
        if (window.innerWidth < 640) {
            this.strokeWidth = 14
        } else {
            this.strokeWidth = 30
        }
        gsap.registerPlugin(DrawSVGPlugin)
        this.surfacePolylines = _.cloneDeep(this.vpgPattern.polylines)
        this.initialiseSVG()
        window.addEventListener("resize", this.updateSVG)
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.updateSVG)
    },
    methods: {
        defineGrid() {  
            this.orientation = this.$el.clientWidth > this.$el.clientHeight ? "landscape" : "portrait"
            this.offset = {x:1, y:1}
            this.verticalLines = this.vpgPattern.height + 2
            this.cellSize = this.$el.clientHeight/this.verticalLines
            this.horizontalLines = Math.ceil(this.$el.clientWidth  / this.cellSize)

            if (this.horizontalLines < this.vpgPattern.width + 2) {
                this.horizontalLines = this.vpgPattern.width + 2
            } 
            if ((this.vpgPattern.width % 2 != 0 && this.horizontalLines % 2 == 0) ||
                (this.vpgPattern.width % 2 == 0 && this.horizontalLines % 2 != 0))
            {
                this.horizontalLines += 1
            }

            this.offset.x = Math.floor(this.horizontalLines/2 - this.vpgPattern.width/2)
            this.cellSize = this.$el.clientWidth/this.horizontalLines
            
            this.grid = []
            for (let y = 0; y < this.verticalLines; y++) {
                this.grid[y] = []
                for (let x = 0; x < this.horizontalLines; x++) {
                    
                    
                    const found = _.find(this.surfacePolylines, p => {
                        return _.find(p, (cord, pIndex) => {
                            if (cord.x == x - this.offset.x && cord.y == y - this.offset.y) {
                                return true
                            }

                            const p1 = {x: x - this.offset.x, y: y - this.offset.y}
                            const p2 = cord
                            const p3 = p[pIndex+1] ? p[pIndex+1] : p[0]

                            if (this.isBetweenCoordinates(p1,p2,p3)) {
                                return true
                            }
                            return false
                        })
                    })

                    if (found) {
                        this.grid[y][x] = 1
                    } else {
                        this.grid[y][x] = 0
                    }
                }
            }
        },
        defineSurface(animate = true as boolean) {
            return new Promise(resolve => {
                const style = {
                    strokeWidth: Math.round(this.cellSize / 2),
                    strokeLinecap: "square",
                }

                if (this.phygital.editMode) {
                    style.strokeWidth = this.strokeWidth
                    style.strokeLinecap = "round"
                }

                // remove old vpg-pattern group when available
                if (this.$el.querySelector(".vpg-pattern")) {
                    this.$el.querySelector(".vpg-pattern").remove()
                }
                const polylines = this.svg.group().addClass("vpg-pattern")
                _.each(this.surfacePolylines, p => {
                    const cords = [] as Array<{x:number, y:number}>
                    const coordinates = _.map(p, cord => {
                        cords.push({
                            x: this.offset.x + cord.x,
                            y: this.offset.y + cord.y
                        })
                        return `${(this.offset.x + cord.x) * this.cellSize + this.cellSize/2},${(this.offset.y + cord.y) * this.cellSize + this.cellSize/2}`
                    }).join(" ")


                    if (cords.length <2) {
                        return
                    }

                    polylines.add(this.svg.polyline(coordinates).attr({
                        class: "vpg-line",
                        dataX1: cords[0].x,
                        dataY1: cords[0].y,
                        dataX2: cords[1].x,
                        dataY2: cords[1].y,
                        fill:"none",
                    }))
                })
                
                if (animate) {
                    gsap.set(".vpg-line", {
                        strokeWidth: 0,
                        strokeLinecap: style.strokeLinecap,
                    })
                    gsap.to(".vpg-line", {
                        strokeWidth: style.strokeWidth,
                        duration: 1.44,
                        ease: "power4.out",
                        onComplete() {
                            resolve(true)
                        }
                    })
                } else {
                    gsap.set(".vpg-line", {
                        strokeWidth: style.strokeWidth,
                        strokeLinecap: style.strokeLinecap,
                        duration: 1.44,
                    })
                    resolve(true)
                }
            })
                
        },
        defineGridPoints(animate = true as boolean) {
            return new Promise(resolve => {
                const gridPointContainer = this.$el.querySelector("#grid-point-container") as SVGElement
                
                // remove old grid-points group when available
                if (this.$el.querySelector(".grid-points")) {
                    this.$el.querySelector(".grid-points").remove()
                }
                const gridPoints = this.svg.group().addClass("grid-points")

                for (let y = 0; y < this.verticalLines; y++) {
                    for (let x = 0; x < this.horizontalLines; x++) {
                        const gridPoint = this.drawGridPoint(gridPointContainer, x, y)
                        if (gridPoint) {
                            gridPoints.add(gridPoint)
                        }
                    }
                }
                
                this.svg.add(gridPoints)
                
                if (this.phygital.editMode && animate)  {
                    gsap.to(".grid-point", {
                        opacity: 1,
                        duration: .8,
                        ease: "power4.out",
                        onComplete: () => {
                            resolve(true)
                        }
                    })
                } else {
                    if (this.phygital.editMode) {
                        gsap.set(".grid-point", {
                            opacity: 1,
                        })
                    }
                    resolve(true)
                }
            })
        },
        removeSurface(animate = true as boolean) {
            // If hard is true, remove the domElements from the svg, otherwise only hide them
            return new Promise(resolve => {
                if (this.$el.querySelectorAll(".vpg-line").length == 0) {
                    return resolve(true)
                }
                
                
                const lines = document.querySelectorAll(".vpg-line")
                const timelines = [] as Array<Promise<boolean>>
                gsap.killTweensOf(lines)
                lines.forEach((line, index) => {
                    timelines.push(new Promise((resolve2) => {
                        const tl = gsap.timeline()
                        tl.to(line, {
                            drawSVG: "0.01%",
                            ease: "power2.out",
                            duration: animate ? .48 : 0,
                            delay: animate ? index * .08 : 0,
                        }).to(line, {
                            opacity: 0,
                            strokeWidth:0,
                            duration: animate ? .24 : 0,
                            onComplete: () => {
                                setTimeout(() => {
                                    resolve2(true)
                                }, animate ? 240 : 0)
                            }
                        })
                    }))
                })

                Promise.all(timelines).then(() => {
                    if (!animate) {
                        return resolve(true)
                    }
                    const svgContainer = this.$refs["vpgSVG"] as HTMLElement
                    if (!svgContainer) return
                    const children =  svgContainer.querySelectorAll(".vpg-line")
                    if (children.length > 0) {
                        for (let i = 0; i < children.length; i++) {
                            const parentNode = children[i].parentNode
                            if (parentNode) {
                                parentNode.removeChild(children[i])
                            }
                        }
                    }
                    resolve(true)
                })
            })
        },
        removeGridPoints(animate = false as boolean) {
            // If hard is true, remove the domElements from the svg, otherwise only hide them
            return new Promise(resolve => {

                if (this.$el.querySelectorAll(".grid-point").length == 0) {
                    return resolve(true)
                }
                
                gsap.killTweensOf(".grid-point")

                const svgContainer = this.$refs["vpgSVG"] as HTMLElement
                if (!svgContainer) return
                const polylines = svgContainer.querySelectorAll(".vpg-line")
                const gridPoints =  svgContainer.querySelectorAll(".grid-point")
                let timeout = animate ? 640 + polylines.length * (24/Math.max(this.horizontalLines, this.verticalLines)/128 * 1000) : 0

                setTimeout(() => {
                    for (let i = 0; i < gridPoints.length; i++) {
                        const parentNode = gridPoints[i].parentNode
                        if (parentNode) {
                            parentNode.removeChild(gridPoints[i])
                        }
                    }
                        
                    return resolve(true)
                }, timeout)

                
                gsap.to(".grid-point", {
                    opacity: 0,
                    duration: .64,
                    stagger: {
                        grid: [this.horizontalLines, this.verticalLines],
                        each: 24/Math.max(this.horizontalLines, this.verticalLines)/32,
                        from: "center"
                    }
                })
            })
        },
        removeLine(target: HTMLElement) {
            this.ignoreAnimation = true
            
            const x1 = target.getAttribute("dataX1")
            const x2 = target.getAttribute("dataX2")
            const y1 = target.getAttribute("dataY1")
            const y2 = target.getAttribute("dataY2")
            const gridPoints = this.$el.querySelectorAll(`
                .grid-point[dataX="${x1}"][dataY="${y1}"],
                .grid-point[dataX="${x1}"][dataY="${y2}"],
                .grid-point[dataX="${x2}"][dataY="${y2}"],
                .grid-point[dataX="${x2}"][dataY="${y1}"]
            `)
            const filteredGridPoints = _.compact(_.filter(gridPoints, (gridPoint) => {
                const x = gridPoint.getAttribute("dataX")
                const y = gridPoint.getAttribute("dataY")
                const matches = _.filter(this.$el.querySelector(`
                .vpg-line[dataX1="${x}"][dataY1="${y}"],
                .vpg-line[dataX2="${x}"][dataY2="${y}"],
                .vpg-line[dataX2="${x}"][dataY1="${y}"],
                .vpg-line[dataX1="${x}"][dataY2="${y}"]
                `), (match) => {
                    if (match.target?.classList.contains("__isRemovable") ||
                        match.node?.classList.contains("__isRemovable")
                    ) {
                        return true
                    }
                    return false
                })
                if (matches.length > 0) {
                    return gridPoint
                } 
                return null
            }))
            
            target.classList.add("__isRemovable")
            _.forEach(filteredGridPoints, (gridPoint) => {
                gridPoint.classList.remove("__isActive")
            })

            const polyline = _.remove(this.surfacePolylines, polyline => {
                const x1 = parseInt(target.getAttribute("dataX1") + "", 10)
                const x2 = parseInt(target.getAttribute("dataX2") + "", 10)
                const y1 = parseInt(target.getAttribute("dataY1") + "", 10)
                const y2 = parseInt(target.getAttribute("dataY2") + "", 10)

                if (polyline[0].x == x1 - this.offset.x &&
                    polyline[0].y == y1 - this.offset.y &&
                    polyline[1].x == x2 - this.offset.x &&
                    polyline[1].y == y2 - this.offset.y
                ) {
                    return true
                } else if (
                    polyline[0].x == x2 - this.offset.x &&
                        polyline[0].y == y2 - this.offset.y &&
                        polyline[1].x == x1 - this.offset.x &&
                        polyline[1].y == y1 - this.offset.y
                ) {
                    return true
                } 
                return false
            })

            if (polyline.length > 0) {
                this.$emit("update:vpgPattern", polyline[0], "remove")
            }
            
            gsap.to(target, {
                opacity: 0,
                duration: .24,
                onComplete: () => {
                    target.remove()
                }
            })

            this.removingLine = true
            setTimeout(() => {
                this.removingLine = false
            }, 500)

        },
        initialiseSVG() {
            this.svg = SVG()
            const svgContainer = this.$refs["vpgSVG"] as HTMLElement
            if (!svgContainer) return
            this.svg.addTo(svgContainer)
            this.defineGrid()
            this.defineSurface()
            this.defineGridPoints()
            this.svg.viewbox(0,0, this.cellSize * this.horizontalLines,  this.cellSize * this.verticalLines)
            this.svg.attr({
                width: Math.round(this.cellSize * this.horizontalLines),
                height: Math.round(this.cellSize * this.verticalLines)
            })
        },
        isBetweenCoordinates(coord: {x:number, y:number}, p1: {x:number, y:number}, p2: {x:number, y:number}) {
            return (
                (p1.x <= coord.x && coord.x <= p2.x && p1.y === coord.y) ||
                (p1.x >= coord.x && coord.x >= p2.x && p1.y === coord.y) ||
                (p1.y <= coord.y && coord.y <= p2.y && p1.x === coord.x) ||
                (p1.y >= coord.y && coord.y >= p2.y && p1.x === coord.x)
            )
        },
        pointsToCoord(points: string) {
            const pointsArray = points.split(" ")
            const coord = pointsArray.map(point => {
                const pointArray = point.split(",")
                return {
                    x: Math.round((parseInt(pointArray[0]) - this.cellSize/2) / this.cellSize),
                    y: Math.round((parseInt(pointArray[1]) - this.cellSize/2) / this.cellSize),
                }
            })
            return coord
        },
        drawGridPoint(gridPointSource: SVGElement, x: number, y: number) {

            if (!gridPointSource) return console.error("Define gridPointSource")

            const innerRing = SVG(gridPointSource).findOne("#grid-point .inner-ring") as any
            const outerRing = SVG(gridPointSource).findOne("#grid-point .outer-ring") as any
            const centerRing = SVG(gridPointSource).findOne("#grid-point .center_ring") as any
            const lineHorizontal = SVG(gridPointSource).findOne("#grid-point .line-horizontal") as any
            const lineVertical = SVG(gridPointSource).findOne("#grid-point .line-vertical") as any
            
            if (!innerRing || !outerRing || !centerRing || !lineHorizontal || !lineVertical) return
            const cellSize = this.cellSize
            const r1 = innerRing.clone()
            const r2 = outerRing.clone()
            const r3 = centerRing.clone()
            const r4 = lineHorizontal.clone()
            const r5 = lineVertical.clone()
            // Create group svg element
            const gridPoint = this.svg.group().addClass("grid-point")

            gridPoint.attr({
                dataX: x,
                dataY: y
            })

            if (this.grid[y][x] === 1) {
                gridPoint.addClass("__isActive")
            }
                
            r1.attr({
                id: `grid-point-${x}-${y}`,
                cx: x*cellSize + cellSize/2,
                cy: y*cellSize + cellSize/2
            })
            r2.attr({
                id: `grid-point-${x}-${y}`,
                cx: x*cellSize + cellSize/2,
                cy: y*cellSize + cellSize/2
            })
            r3.attr({
                id: `grid-point-${x}-${y}`,
                cx: x*cellSize + cellSize/2,
                cy: y*cellSize + cellSize/2
            })
            r4.attr({
                id: `grid-point-${x}-${y}`,
                x1: x*cellSize + cellSize/2 - 4,
                y1: y*cellSize + cellSize/2,
                x2: x*cellSize + cellSize/2 + 4,
                y2: y*cellSize + cellSize/2,
                style: `transform-origin: ${x*cellSize + cellSize/2}px ${y*cellSize + cellSize/2}px;`
            })
            r5.attr({
                id: `grid-point-${x}-${y}`,
                x1: x*cellSize + cellSize/2,
                y1: y*cellSize + cellSize/2 - 4,
                x2: x*cellSize + cellSize/2 ,
                y2: y*cellSize + cellSize/2 + 4,
                style: `transform-origin: ${x*cellSize + cellSize/2}px ${y*cellSize + cellSize/2}px;`
            })

            if (window.innerWidth < 640) {
                _.forEach([r1, r2, r3], (r) => {
                    r.attr({
                        r: parseInt(r.node.getAttribute("r"), 10)/2,
                    })
                })
            }

            gridPoint.add(r3)
            gridPoint.add(r2)
            gridPoint.add(r1)
            gridPoint.add(r4)
            gridPoint.add(r5)

            if ((x - this.offset.x >= 0) &&
                (x - this.offset.x < this.vpgPattern.width) &&
                (y - this.offset.y >= 0) &&
                (y - this.offset.y < this.vpgPattern.height)
            ) {
                gridPoint.addClass("__hasHover")
            }

            gsap.set(gridPoint, {opacity: 0})

            return gridPoint
        },
        updateSVG() {
            if (window.innerWidth < 640) {
                this.strokeWidth = 14
            } else {
                this.strokeWidth = 30
            }
            
            const svgContainer = this.$refs["vpgSVG"] as HTMLElement
            if (!svgContainer) return
            
            const children =  svgContainer.querySelectorAll(".vpg-line, .grid-point")
            if (children.length > 0) {
                for (let i = 0; i < children.length; i++) {
                    const parentNode = children[i].parentNode
                    if (parentNode) {
                        parentNode.removeChild(children[i])
                    }
                }
            }
                    
            this.defineGrid()
            this.defineSurface()
            this.defineGridPoints()
            this.svg.viewbox(0,0, this.cellSize * this.horizontalLines,  this.cellSize * this.verticalLines)
            this.svg.attr({
                width: Math.round(this.cellSize * this.horizontalLines),
                height: Math.round(this.cellSize * this.verticalLines)
            })
        },
        getGridPoint(x:number,y:number) {
            // The +/1 is to increase target area, but the way it is currently done is not good enough
            let target = null
            if ((Math.round(x) < x + .1) &&
                (Math.round(x) > x - .1) &&
                (Math.round(y) < y + .1) &&
                (Math.round(y) > y - .1)
            ) {
                target = this.svg.findOne(`[dataX="${Math.round(x)}"][dataY="${Math.round(y)}"]`)?.node
            }
            return target
        },
        getLine(posX:number,posY:number) {
            let target = null as null | Array<{x:number, y:number}>
            // Match against horizontal lines
            this.surfacePolylines.forEach((polyline: Array<{x:number, y:number}>) => {
                if ((Math.round(posY) > posY-.1 && Math.round(posY) < posY+.1) &&
                    (posX > Math.floor(posX)+.16  && posX < Math.ceil(posX)-.16 )
                ) {
                    if (Math.round(posY) == polyline[0].y+this.offset.y && polyline[0].y == polyline[1].y) {
                        let match = 0
                        polyline.forEach((point: {x:number, y:number}) => {
                            if (point.x+this.offset.x == Math.floor(posX) ||
                                point.x+this.offset.x == Math.ceil(posX)
                            ) {
                                match++
                            }
                        })
                        if (match == 2) {
                            target = polyline
                        }
                    }
                // Match against vertical lines
                } else if((Math.round(posX) > posX-.1 && Math.round(posX) < posX+.1) &&
                    (posY > Math.floor(posY)+.16  && posY < Math.ceil(posY)-.16 )) {
                    if (Math.round(posX) == polyline[0].x+this.offset.x && polyline[0].x == polyline[1].x) {
                        let match = 0
                        polyline.forEach((point: {x:number, y:number}) => {
                            if (point.y+this.offset.y == Math.floor(posY) ||
                                point.y+this.offset.y == Math.ceil(posY)
                            ) {
                                match++
                            }
                        })
                        if (match == 2) {
                            target = polyline
                        }
                    }
                }
            })

            if (_.isNull(target)) {
                return null
            }
            return this.$el.querySelector(` 
                    .vpg-line[dataX1="${target[0].x + this.offset.x}"][dataY1="${target[0].y + this.offset.y}"][dataX2="${target[1].x + this.offset.x}"][dataY2="${target[1].y + this.offset.y}"],
                    .vpg-line[dataX1="${target[1].x + this.offset.x}"][dataY1="${target[1].y + this.offset.y}"][dataX2="${target[0].x + this.offset.x}"][dataY2="${target[0].y + this.offset.y}"]
            `)
        },
        onClick(event: MouseEvent) {
            // const target = event.target as HTMLElement
            // const parentNode = target.parentNode as HTMLElement
            
            if (!this.phygital.editMode) return
            
            setTimeout(() => {
                if (this.newLine.length == 0) {
                    // Start new line
                    const gridPoint = this.getGridPoint(this.mousePosX, this.mousePosY) as HTMLElement | null
                    if (gridPoint) {   
                        if (gridPoint.classList.contains("__hasHover")) {
                            this.startNewLine(Math.round(this.mousePosX), Math.round(this.mousePosY))
                            return
                        }
                    }
                    
                    // Remove line
                    const line = this.getLine(this.mousePosX, this.mousePosY)
                    if (line) {
                        this.removeLine(line)
                        return
                    }
                } else if (this.newLine.length == 1) {
                    
                    // Cancel new line
                    if (!this.newLineEndPos) {
                        this.cancelNewLine()
                        return
                    }
                    
                    const target = this.getGridPoint(this.newLineEndPos.x, this.newLineEndPos.y) as HTMLElement | null
                    if (!target) {
                        this.cancelNewLine()
                        return
                    }
                
                    const duplicate = this.$el.querySelector(`
                        .vpg-line[dataX1="${this.newLine[0].x}"][dataY1="${this.newLine[0].y}"][dataX2="${this.newLineEndPos.x}"][dataY2="${this.newLineEndPos.y}"],
                        .vpg-line[dataX1="${this.newLineEndPos.x}"][dataY1="${this.newLineEndPos.y}"][dataX2="${this.newLine[0].x}"][dataY2="${this.newLine[0].y}"]
                    `)
                
                    if (duplicate) {
                        this.cancelNewLine()
                        return
                    }

                    // Add new line
                    this.newLine.push({
                        x: Math.round(this.newLineEndPos.x),
                        y: Math.round(this.newLineEndPos.y)
                    })

                    this.completeNewLine()
                }
            })
        },
        highlightRemovableLine(line: HTMLElement | null) {
            if (this.removableLine && this.removableLine != line) {
                gsap.killTweensOf(this.removableLine)
                gsap.to(this.removableLine, {
                    duration: .64, 
                    stroke: "#1c1c1e",
                    strokeWidth: this.strokeWidth,
                    opacity: 1,
                })
            }

            this.removableLine = line

            if (line){ 
                const patternGroup = this.$el.querySelector(".vpg-pattern")
                    
                if (!patternGroup) return
                patternGroup.appendChild(this.removableLine)
                gsap.killTweensOf(line)
                gsap.to(line, {
                    duration: .64, 
                    stroke: "#545760",
                    strokeWidth: this.strokeWidth,
                    opacity: .72,
                })
            }
        },
        mouseMove(event: MouseEvent) {

            // sanitize mouse position to match svg element x &  y
            const rect = this.svg.node.getBoundingClientRect()
            this.mouseX = event.clientX - rect.left
            this.mousePosX = (this.mouseX-this.cellSize/2) / this.cellSize
            this.mouseY = event.clientY - rect.top
            this.mousePosY = (this.mouseY-this.cellSize/2) / this.cellSize



            // Cancel if in transition
            if (this.surfaceInTransition) return
            if (this.removingLine) return


            const currentTarget = event.currentTarget as HTMLElement
            if (!currentTarget) return
            
            if (!this.mouseX || !this.mouseY) return

            // If no newLine is active, check if we are hovering over a line or gridPoint
            if (this.newLine.length == 0 && this.phygital.editMode) {
                const line = this.getLine(this.mousePosX, this.mousePosY)
                this.highlightRemovableLine(line)
                if (line) return
                const gridPoint = this.getGridPoint(this.mousePosX, this.mousePosY) 
            }

            if (this.newLine.length == 1 && this.phygital.editMode) {
                if (this.removeNewLine) return


                // get grid point that is at position event.clientX & event.clientY with a radius of this.cellSize/2
                const gridPoint = this.getGridPoint(this.mousePosX, this.mousePosY)
                const newLine = this.$el.querySelector(".new-line") as HTMLElement
                
                if (gridPoint && gridPoint.classList.contains("__isOption")) {
                    if (
                        newLine.getAttribute("x2") != `${this.mousePosX}` &&
                        newLine.getAttribute("y2") != `${this.mousePosY}`
                    ) {
                        this.newLineEndPos = {
                            x: Math.round(this.mousePosX),
                            y: Math.round(this.mousePosY)
                        }

                        gsap.to(newLine, {
                            opacity: 1,
                            duration: .8,
                            attr: {
                                x2: parseInt(gridPoint.getAttribute("dataX") + "", 10) * this.cellSize + this.cellSize/2,
                                y2: parseInt(gridPoint.getAttribute("dataY") + "", 10) * this.cellSize + this.cellSize/2
                            },
                            ease: "power4.out",
                        })
                    }
                } else {
                    // Not the most efficent method to do this, but it works
                    this.newLineEndPos = null
                    gsap.killTweensOf(".new-line")
                    gsap.to(".new-line", {
                        opacity: 0.5,
                        duration: .8,
                        ease: "power4.out",
                    })

                    newLine.setAttribute("x2", `${this.mouseX}`)
                    newLine.setAttribute("y2", `${this.mouseY}`)
                }
                
            }
        },
        startNewLine(posX: number, posY: number) {
            let height = 0
            let width = 0
            
            const newLineEl = this.$el.querySelector(".new-line") as HTMLElement
            if (newLineEl) {
                newLineEl.remove()
            }

            // posX implementeren en posY
            if (!posX || !posY) return
            const gridPoint = this.$el.querySelector(`.grid-point[dataX="${posX}"][dataY="${posY}"]`) as HTMLElement
            const topPoint = this.$el.querySelector(`.grid-point[dataX="${posX}"][dataY="${posY - 1}"]`) as HTMLElement
            const bottomPoint = this.$el.querySelector(`.grid-point[dataX="${posX}"][dataY="${posY + 1}"]`) as HTMLElement
            const leftPoint = this.$el.querySelector(`.grid-point[dataX="${posX - 1}"][dataY="${posY}"]`) as HTMLElement
            const rightPoint = this.$el.querySelector(`.grid-point[dataX="${posX + 1}"][dataY="${posY}"]`) as HTMLElement
            

            if (this.phygital.selectedSurface == "bottom") {
                height = this.vpgPattern.height
                width = this.vpgPattern.width
            } else if (this.phygital.selectedSurface == "top") {
                height = this.vpgPattern.height
                width = this.vpgPattern.width
            } else if (this.phygital.selectedSurface == "left") {
                height = this.vpgPattern.height
                width = this.vpgPattern.width
            } else if (this.phygital.selectedSurface == "right") {
                height = this.vpgPattern.height
                width = this.vpgPattern.width
            } else if (this.phygital.selectedSurface == "front") {
                height = this.vpgPattern.height
                width = this.vpgPattern.width
            } else if (this.phygital.selectedSurface == "back") {
                height = this.vpgPattern.height
                width = this.vpgPattern.width
            }


            if (topPoint && posY - this.offset.y > 0) {
                topPoint.classList.add("__isOption")
            }
            if (bottomPoint && posY - this.offset.y < height-1) {
                bottomPoint.classList.add("__isOption")
            }
            if (leftPoint && posX - this.offset.x > 0) {
                leftPoint.classList.add("__isOption")
            }
            if (rightPoint &&  posX - this.offset.x < width-1) {
                rightPoint.classList.add("__isOption")
            }
            
            const newLine = this.svg.line(
                posX*this.cellSize + this.cellSize/2,
                posY*this.cellSize+ this.cellSize/2,
                posX*this.cellSize + this.cellSize/2,
                posY*this.cellSize+ this.cellSize/2
            )

            newLine.attr({
                class: "new-line",
                style: `stroke-width: ${this.strokeWidth}px;
                        stroke-linecap: round;
                        opacity: 0.5;
                        stroke: #1c1c1e;`
            })
            this.svg.add(newLine)
            // gridPoint.classList.add("__isActive")
            this.newLine.push({x: posX, y: posY})
        },
        cancelNewLine() {
            const startPoint = this.getGridPoint(this.newLine[0].x, this.newLine[0].y)
            this.removeNewLine = true
            this.newLine.length = 0
            this.removeNewLine = false
            const newLine = this.$el.querySelector(".new-line") as HTMLElement
            const posX1 = Math.round((parseInt(newLine.getAttribute("x1") + "", 10)- this.cellSize/2)/this.cellSize)
            const posY1 = Math.round((parseInt(newLine.getAttribute("y1") + "", 10)- this.cellSize/2)/this.cellSize)

            const options = []
            options.push(this.$el.querySelector(`g[dataX='${posX1-1}'][dataY='${posY1}']`))
            options.push(this.$el.querySelector(`g[dataX='${posX1+1}'][dataY='${posY1}']`))
            options.push(this.$el.querySelector(`g[dataX='${posX1}'][dataY='${posY1-1}']`))
            options.push(this.$el.querySelector(`g[dataX='${posX1}'][dataY='${posY1+1}']`))
            
            _.each(_.compact(options), (option) => {
                option.classList.remove("__isOption")
                /// Having an animation is great, but it;s not defined properly yet
                // gsap.to(option, {
                //     duration: 0.8,
                //     opacity: 0,
                //     ease: "power4.out",
                //     onComplete: () => {
                //         if (option) {
                //             option.classList.remove("__isOption")
                //         }
                //     }
                // })
            })

            gsap.to(".new-line", {
                opacity: 0,
                duration: 1.32,
                ease: "power4.out",
                onComplete: () => {
                    if (newLine) {
                        newLine.remove()
                    }
                }
            })
        },
        completeNewLine() {
            this.ignoreAnimation = true
            this.removeNewLine = true
            
            if (this.newLineEndPos) {
                this.newLineEndPos = null
            }

            if (this.newLine.length != 2) {
                console.error("Invalid length for newLine")
                return
            }
            
            // const targetPoint = this.getGridPoint(xPos, yPos)

            const startPoint = this.getGridPoint(this.newLine[0].x, this.newLine[0].y)
            const endPoint = this.getGridPoint(this.newLine[1].x, this.newLine[1].y)

            if (!startPoint || !endPoint) {
                console.error("Invalid start or end point")
                return
            }

            // Add new-line
            const newLine = [
                {x: this.newLine[0].x - this.offset.x, y: this.newLine[0].y - this.offset.y},
                {x: this.newLine[1].x - this.offset.x, y: this.newLine[1].y - this.offset.y}
            ]


            if (!startPoint.classList.contains("__isActive")) {
                startPoint.classList.add("__isActive")
            } 

            if (!endPoint.classList.contains("__isActive")) {
                endPoint.classList.add("__isActive")
            } 

            this.$el.querySelectorAll(".__isOption").forEach((el: HTMLElement) => {
                el.classList.remove("__isOption")
            })
            
            this.removeNewLine = false
            this.newLine.length = 0
            this.surfacePolylines.push(newLine)
            this.$el.querySelector(".new-line").remove()
            this.$emit("update:vpgPattern", _.clone(newLine), "add")
        }
        
    }
})
</script>

<style lang="scss">
@import "./../assets/scss/variables.scss";
.vpg-svg-editable {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    &.__isEditMode {
        .grid-point {
            &.__hasHover {
                pointer-events: all;
                cursor: pointer;
            }
        }
    }
    
    figure {
        margin: 0;
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
    }
    
    svg {
        width: 100%;
        max-width: 100%;
        max-height: 100%;
        display: block;
        position: relative;
        // border: 1px solid red;
    }
    
    .grid-point {
        z-index: 1;
        pointer-events: none;
        &.__hasHover {
            .inner-ring {
                opacity: 1;
            }
            .outer-ring {
                opacity: 1;
            }
        }
        &.__hasHover:hover {
            
            .line-vertical,
            .line-horizontal {
                scale: 1;
                opacity: 1;
            }
            .outer-ring {
                fill: $light-grey;
                // stroke-width: 0;
            }
        }

        &.__isActive {
            .inner-ring {
                stroke: $dark-grey2;
            }
            .outer-ring {
                stroke: $dark-grey;
                stroke-width: 1px;
                opacity: 1;
            }
        }
        &.__isOption {
            .inner-ring {
                opacity: 0;
            }
            .outer-ring {
                stroke: $dark-grey2;
                stroke-dasharray: 4 2.4;
                opacity: 0.5;
                opacity: 1;
            }
            &.__isActive {
                .outer-ring {
                    stroke: $light-grey;
                    stroke-width: 2px;
                }
            }
            &.__hasHover:hover {
                .outer-ring {
                    opacity: 1;
                }
                line {
                    opacity: 0;
                }
                .inner-ring {
                    fill: $light-grey;
                    opacity: 1;
                    stroke: $light-grey2;
                    stroke-dasharray: none;
                }
            }
        }
    }
    
    polyline {
        stroke: $black;
        stroke-width: .5;
        stroke-type: solid;
        stroke-linecap: square;
    }
    .outer-ring {
        stroke: #e4e5ea;
        stroke-width: 2px;
        fill: transparent;
        transition: .32s all ease;
        opacity:.48;
    }
    .inner-ring {
        stroke: #ced1db;
        stroke-width: 1px;
        stroke-dasharray: 3.2 1.6;
        fill: transparent;
        transition: .32s all ease;
        opacity: 0;
    }

    .line-vertical,
    .line-horizontal {
        opacity: 0;
        stroke-width: 2px;
        transition: .32s all ease;
        stroke: #2d2e33;
        scale: .8;
        stroke-linecap: round;  
    }
    
    .center_ring {
        fill: transparent;
    }
}

</style>
