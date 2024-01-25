<!-- 
use the .vpg-svg-content for styling the content inside the box. Best way is to style it via the parent component/route that you put this element in.
 -->

 <template>
     <div class="vpg-svg-editable" :class="[
         app.editMode ? '__isEditMode' : '',
         '__isBlock'
        ]">

        <figure ref="vpgSVGcontainer" @mousedown="onClickEvent" @mousemove="mouseMoveEvent">
            <svg 
                :viewBox="`0,0, ${Math.round(cellSize * horizontalLines)},  ${Math.round(cellSize * verticalLines)}`"
                :width="Math.round(cellSize * horizontalLines)"
                :height="Math.round(cellSize * verticalLines)"
                ref="vpgSVG"
                
                v-if="vpgPattern"
            >
                <g class="vpg-pattern">
                    <polyline v-for="(polyline, p) in polylinePoints" :key="p" 
                        class="vpg-line"
                        :points="`${polyline[0].x} ${polyline[0].y}, ${polyline[1].x} ${polyline[1].y}`"
                        :dataX1="polylineCords[p][0].x"
                        :dataY1="polylineCords[p][0].y"
                        :dataX2="polylineCords[p][1].x"
                        :dataY2="polylineCords[p][1].y"
                        :dataIndex="p"
                        fill="none"
                        ref="polyline"
                        @mouseenter="hideLine(p)"
                        @mouseleave="showLine(p)"
                    />
                
                </g>
                <g class="grid-points">
                    <g v-for="(yIndex, y) in verticalLines" :key="y">
                        <g v-for="(xIndex, x) in horizontalLines" :key="x" 
                            class="grid-point"
                            :dataX="x"
                            :dataY="y"
                            :class="(x - offset.x >= 0) && (x - offset.x < vpgPattern.width) && (y - offset.y >= 0) && (y - offset.y < vpgPattern.height) ? '__hasHover' : ''"
                            :id="`grid-point-${x}-${y}`
                        ">
                            <circle  class="center-ring" :cx="x*cellSize + cellSize/2" :cy="y*cellSize + cellSize/2" r="4"/>
                            <circle  class="inner-ring" :cx="x*cellSize + cellSize/2" :cy="y*cellSize + cellSize/2" r="8"/>
                            <circle  class="outer-ring" :cx="x*cellSize + cellSize/2" :cy="y*cellSize + cellSize/2" r="12"/>
                            <line class="line-horizontal" 
                                :x1=" x*cellSize + cellSize/2 - 4" 
                                :y1="y*cellSize + cellSize/2" 
                                :x2="x*cellSize + cellSize/2 + 4" 
                                :y2="y*cellSize + cellSize/2" 
                                :style="`transform-origin: ${x*cellSize + cellSize/2}px ${y*cellSize + cellSize/2}px`"
                            />
                            <line class="line-vertical" 
                                :x1="x*cellSize + cellSize/2"
                                :y1="y*cellSize + cellSize/2 - 4"
                                :x2="x*cellSize + cellSize/2"
                                :y2="y*cellSize + cellSize/2 + 4"
                                :style="`transform-origin: ${x*cellSize + cellSize/2}px ${y*cellSize + cellSize/2}px`
                            "/>
                        </g>
                    </g>
                </g>
                <g class="new-line-group" v-if="newLine.length == 2" >
                    <line 
                        :x1="newLine[0].x" 
                        :y1="newLine[0].y" 
                        :x2="newLine[1].x" 
                        :y2="newLine[1].y" 
                        class="new-line"
                        :stroke-width="`${strokeWidth}px`"
                    />
                </g>
            </svg>
        </figure>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import { phygitalSeedEvent, Surface } from "@/stores/phygital"
import gsap from "@/services/gsap-wrapper"

import PhygitalStore from "@/stores/phygital"
import AppStore from "@/stores/app"
import _ from "lodash"


export default defineComponent({
    name: "vpg-svg-editable",
    setup() {
        const phygital = PhygitalStore()
        const app = AppStore()

        return {
            phygital, 
            app
        }
    },
    data: () => {
        return {
            orientation: "portrait" as "portrait" | "landscape",
            cellSize: 0,
            verticalLines: 0,
            horizontalLines: 0,
            offset: {x:1, y:1} as {x:number, y:number},
            strokeWidth: 30,
            polylinePoints: [] as Array<Array<{x: number, y: number}>>,
            polylineCords: [] as Array<Array<{x: number, y: number}>>,
            newLine: [] as Array<{x:number, y:number}>,
            manualUpdate: false,
            disableNewLine: false,

            mouseX: 0,
            mouseY: 0,
            mousePointX: 0,
            mousePointY: 0,
        }
    },
    computed: {
        vpgPattern() {
            if (this.phygital?.surfaces && this.app) {
                const activeSurface = this.app.activeSurface as "top" | "bottom" | "front" | "back" | "left" | "right"
                return this.phygital.surfaces[activeSurface] as Surface
            }
            return null
        },
        isDev() {
            return import.meta.env.DEV
        }
    },
    watch: {
        "app.editMode": {
            handler(editMode) {
                const el = this.$el
                if (!el || el.querySelectorAll(".vpg-line").length <=0) {
                    return
                }
                
                // gsap.killTweensOf(".grid-point")
                // gsap.killTweensOf(".vpg-line")

                // Line removal
                const removedLines = el.querySelectorAll(".vpg-line.__isRemoved") as Array<HTMLElement>
                if (removedLines) {
                    removedLines.forEach(line => {
                        line.remove()
                    })
                }

                if (editMode) {
                    this.enterEditMode()
                } else {
                    this.leaveEditMode()
                }
            }
        },

        
        "app.activeSurface": {
            handler() {
                if (this.newLine.length == 2 ){
                    this.cancelNewLine()
                }
                Promise.all([
                    this.hideGrid(this.app.showAnimations),
                    this.hidePolylines(this.app.showAnimations)
                ]).then(() => {
                    this.updatePattern()
                })
            },
            deep: true
        },
        "vpgPattern.polylines": {
            handler() {
                if (this.manualUpdate) {
                    this.updatePattern()
                    this.manualUpdate = false
                    return
                }
            },
            deep: true
        }
        
    },
    mounted() {
        if (document.body.classList.contains("__isPortrait")) {
            this.strokeWidth = 14
        } else {
            this.strokeWidth = 30
        }


        if (this.vpgPattern && this.isDev) {
            window.removeEventListener("phygital:seed", this.phygitalSeedEvent)
            window.removeEventListener("phygital:update", this.phygitalUpdateEvent)
            window.removeEventListener("resize", this.resizeEvent)
            window.removeEventListener("keydown", this.keydownEvent)
        } 
        this.updatePattern()

        window.addEventListener("phygital:seed", this.phygitalSeedEvent)
        window.addEventListener("phygital:update", this.phygitalUpdateEvent)
        window.addEventListener("resize", this.resizeEvent)
        window.addEventListener("keydown", this.keydownEvent)
    },
    beforeUnmount() {
        window.removeEventListener("phygital:seed", this.phygitalSeedEvent)
        window.removeEventListener("phygital:update", this.phygitalUpdateEvent)
        window.removeEventListener("resize", this.resizeEvent)
        window.removeEventListener("keydown", this.keydownEvent)
    },
    methods: {
        // Events
        phygitalSeedEvent(e : Event) {
            const event = e as phygitalSeedEvent   
            
            if (event.detail == "prepareChange") {  
                if (this.newLine.length == 2 ){
                    this.cancelNewLine()
                } 
                Promise.all([
                    this.hideGrid(this.app.showAnimations),
                    this.hidePolylines(this.app.showAnimations)
                ]).then(() => {
                    window.dispatchEvent(new CustomEvent("phygital:seed", {detail: "changed"}))
                })
            }
        },
        phygitalUpdateEvent(e : Event) {
            this.updatePattern()
        },
        resizeEvent() {
            if (window.innerWidth < 640) {
                this.strokeWidth = 14
            } else {
                this.strokeWidth = 30
            }

            this.updatePattern()
        },
        keydownEvent(e: KeyboardEvent) {
            if (e.key == "Escape" && this.newLine.length == 2) {
                this.cancelNewLine()
            }
        },
        onClickEvent(event: MouseEvent) {
            // No changes when not in edit mode
            if (!this.app.editMode) return

            const target = event.target as HTMLElement

            if (target.classList.contains("vpg-line")) {
                this.removeLine(target)
                event.preventDefault()
                return
            }
            
            
            if (this.newLine.length == 0) {
                // Start new line
                const gridPoint = this.getGridPoint(this.mousePointX, this.mousePointY) as HTMLElement | null
                
                if (gridPoint) {   
                    if (gridPoint.classList.contains("__hasHover")) {
                        this.startNewLine(Math.round(this.mousePointX), Math.round(this.mousePointY))
                        return
                    }
                }

            } else if (this.newLine.length == 2) {
                // Update newLine to clicked position because it is not updated by mousemove on touchscreens
                this.newLine[1] = {x: this.mouseX, y: this.mouseY}

                const newLinePoint = this.cordToPoint(this.newLine[1])
                const targetGridPoint = this.getGridPoint(newLinePoint.x, newLinePoint.y) as SVGAElement | null
                if (targetGridPoint) {
                    if (targetGridPoint.classList.contains("__isOption")) {
                        const newLine = [
                            this.cordToPoint(this.newLine[0]),
                            this.cordToPoint(this.newLine[1])
                        ]
                        
                        // Prevent polylines to be added over each other
                        const duplicate = this.$el.querySelector(`
                                .vpg-line[dataX1="${newLine[0].x}"][dataY1="${newLine[0].y}"][dataX2="${newLine[1].x}"][dataY2="${newLine[1].y}"],
                                .vpg-line[dataX1="${newLine[1].x}"][dataY1="${newLine[1].y}"][dataX2="${newLine[0].x}"][dataY2="${newLine[0].y}"]
                            `)

                        if (duplicate) {
                            this.cancelNewLine()
                            return
                        }


                        // Set manual update to prevent redraw of pattern
                        this.manualUpdate = true
                        this.phygital.addLine(_.map(newLine, line => {
                            return {
                                x: line.x - this.offset.x ,
                                y: line.y - this.offset.y
                            }
                        }), this.app.activeSurface)

                    }
                } 
                this.cancelNewLine()
            }
        },
        mouseMoveEvent(event: MouseEvent) {
            const svgElement = this.$refs["vpgSVG"] as SVGAElement
            // sanitize mouse position to match svg element x &  y
            const rect = svgElement.getBoundingClientRect()
            
            this.mouseX = event.clientX - rect.left
            this.mousePointX = (this.mouseX - this.cellSize/2) / this.cellSize
            this.mouseY = event.clientY - rect.top
            this.mousePointY = (this.mouseY - this.cellSize/2) / this.cellSize
            
            // Add new line logic
            if (this.newLine.length == 2) {
                if (this.disableNewLine) {
                    return
                }

                const hoveredGridPoint = this.getGridPoint(this.mousePointX, this.mousePointY)
                // When position is optionable
                if (hoveredGridPoint?.classList.contains("__isOption")) {
                    const x = parseInt(hoveredGridPoint.getAttribute("dataX") || "", 10) 
                    const y = parseInt(hoveredGridPoint.getAttribute("dataY") || "", 10) 
                    gsap.to(this.newLine[1], {
                        x: (x  * this.cellSize) + this.cellSize/2,
                        y: (y  * this.cellSize) + this.cellSize/2,
                        duration: .32
                    })
                    
                    if (gsap.getProperty(".new-line", "opacity") != 1) {
                        gsap.killTweensOf(".new-line:not(.__isRemoved)")
                        gsap.to(".new-line", {
                            opacity: 1,
                            duration: .8,
                            ease: "power4.out",
                        })
                    }
                } else {
                    if (gsap.getProperty(".new-line", "opacity") != 0.5) {
                        gsap.killTweensOf(".new-line:not(.__isRemoved)")
                        gsap.to(".new-line", {
                            opacity: 0.5,
                            duration: .8,
                            ease: "power4.out",
                        })
                    }
                    this.newLine[1] = {x: this.mouseX, y: this.mouseY}
                }
            }
        },
        leaveEditMode(){

            const pointOptions = {
                ease: "back.out(3.2)",
                duration: 0.4,
                stagger: {
                    grid: [this.horizontalLines, this.verticalLines],
                    each: 24/Math.max(this.horizontalLines, this.verticalLines)/32,
                    from: "edges",
                }
            } as gsap.TweenVars

            gsap.to(".grid-point", {
                opacity: 0,
                ...pointOptions
            })

            gsap.to(".vpg-line", {
                strokeWidth: Math.round(this.cellSize / 2),
                strokeLinecap: "square",
                duration: 1.44,
                ease: "back.out(1.7)",
            })
            gsap.to(".grid-point .center-ring", {
                r: 4,
                ...pointOptions
            })
            gsap.to(".grid-point .inner-ring", {
                r: 8,
                ...pointOptions
            })
            gsap.to(".grid-point .outer-ring", {
                r: 12,
                ...pointOptions
            })
        },
        enterEditMode(){

            const pointOptions = {
                ease: "back.out(3.2)",
                duration: 0.4,
                stagger: {
                    grid: [this.horizontalLines, this.verticalLines],
                    each: 24/Math.max(this.horizontalLines, this.verticalLines)/32,
                    from: "edges",
                }
            } as gsap.TweenVars

            gsap.to(".grid-point", {
                opacity: 1,
                ...pointOptions
            })
            if (document.body.classList.contains("__isPortrait")) {
                gsap.to(".grid-point .center-ring", {
                    r: 2,
                    ...pointOptions
                })
                gsap.to(".grid-point .inner-ring", {
                    r: 4,
                    ...pointOptions
                })
                gsap.to(".grid-point .outer-ring", {
                    r: 6,
                    ...pointOptions
                })
            } else {
                gsap.to(".grid-point .center-ring", {
                    r: 4,
                    ...pointOptions
                })
                gsap.to(".grid-point .inner-ring", {
                    r: 8,
                    ...pointOptions
                })
                gsap.to(".grid-point .outer-ring", {
                    r: 12,
                    ...pointOptions
                })
            }

            gsap.to(".vpg-line", {
                strokeWidth: this.strokeWidth,
                strokeLinecap: "round",
                duration: 0.8,
                ease: "back.out(3.2)",
            })
        },
        
        // Helper methods
        updatePattern() {

            if (this.newLine.length == 2 ){
                this.cancelNewLine()
            }

            this.defineGrid()
            this.definePolylines()       
            
            this.$nextTick(() => {
                this.showPolylines()     
                this.showGrid()    
                if (this.app.editMode)  {
                    this.enterEditMode()
                }
            })
        },
        getGridPoint(x:number,y:number) {            
            const svgElement = this.$refs["vpgSVG"] as SVGAElement
            // The +/1 is to increase target area, but the way it is currently done is not good enough
            let target = null
            if ((Math.round(x) < x + .48) &&
        (Math.round(x) > x - .48) &&
        (Math.round(y) < y + .48) &&
        (Math.round(y) > y - .48)
            ) {
                target = svgElement.querySelector(`[dataX="${Math.round(x)}"][dataY="${Math.round(y)}"]`)
            }
            return target
        },
        cordToPoint(cord: {x: number, y:number}) {
            return {
                x: Math.round((cord.x - this.cellSize/2) / this.cellSize),
                y: Math.round((cord.y - this.cellSize/2) / this.cellSize)
            }
        },
        
        // Grid methods
        defineGrid() {  
            if (!this.vpgPattern) {
                return "defineGrid(): Missing vpgPattern"
            }

            this.orientation = this.$el.clientWidth > this.$el.clientHeight ? "landscape" : "portrait"
            this.offset = {x:1, y:1}
            this.verticalLines = this.vpgPattern.height + 2
            this.horizontalLines = this.vpgPattern.width + 2
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
        },
        showGrid(animate = true as boolean) {
            return new Promise(resolve => {
                if (this.app.editMode && animate)  {
                    gsap.to(".grid-point", {
                        opacity: 1,
                        duration: .8,
                        ease: "power4.out",
                        onComplete: () => {
                            resolve(true)
                        }
                    })
                } else {
                    if (this.app.editMode) {
                        gsap.set(".grid-point", {
                            opacity: 1,
                        })
                    }
                    resolve(true)
                }
            })
        },
        hideGrid(animate = false as boolean) {
            return new Promise((resolve, reject) => {
                // Check if there are .grid-point's available

                if (this.$el.querySelectorAll(".vpg-line").length == 0) {
                    return resolve(true)
                }
                
                if (this.$el.querySelectorAll(".grid-point").length == 0) {
                    console.warn("no .grid-point's found")
                    return resolve(true)
                }
                
                // Stop existing animations
                gsap.killTweensOf(".grid-point")
                
                // Do animation
                gsap.to(".grid-point", {
                    opacity: 0,
                    duration: .64,
                    onComplete: () => {
                        resolve(true)
                    },
                    stagger: {
                        grid: [this.horizontalLines, this.verticalLines],
                        each: animate ? 24/Math.max(this.horizontalLines, this.verticalLines)/32 : 0,
                        from: "center"
                    }
                })
            })
        },

        // (Poly)line methods
        definePolylines() {
            if (!this.vpgPattern) {
                return "definePolylines(): Missing vpgPattern"
            }
            const temp = _.sortBy(this.vpgPattern.polylines)
            
            this.polylinePoints =  _.map(temp, polyline => {
                return _.map(polyline, cord => {
                    return {
                        x:  (this.offset.x + cord.x) * this.cellSize + this.cellSize/2,
                        y:  (this.offset.y + cord.y) * this.cellSize + this.cellSize/2
                    }
                })
            })
            this.polylineCords =  _.map(temp, polyline => {
                return _.map(polyline, cord => {
                    return {
                        x:  cord.x + this.offset.x,
                        y:  cord.y+ this.offset.y
                    }
                })
            })
        },
        showPolylines() {

            const el = this.$el
            if (!el || el.querySelectorAll(".vpg-line").length <=0) {
                return
            }
                
            if (this.app.editMode) {
                gsap.to(".vpg-line", {
                    strokeWidth: this.strokeWidth,
                    strokeLinecap: "round",
                    duration: 0.8,
                    opacity: 1,
                    drawSVG: "100%",
                    ease: "back.out(3.2)",
                })
            } else {
                gsap.to(".vpg-line", {
                    opacity: 1,
                    drawSVG: "100%",
                    strokeWidth: Math.round(this.cellSize / 2),
                    strokeLinecap: "square",
                    duration: 1.44,
                    ease: "back.out(1.7)",
                })
            }
        },
        hidePolylines(animate = true as boolean) {
            return new Promise((resolve, reject) => {
                if (this.$el.querySelectorAll(".vpg-line").length == 0) {
                    return resolve(true)
                }
                
                const totalDuration = 2
                let simultaneousLines = 1 
                const lines = document.querySelectorAll(".vpg-line")
                let duration = totalDuration/lines.length
                
                if (duration < .05) {
                    simultaneousLines = 8
                    duration = duration*8
                } else if (duration < .1) {
                    simultaneousLines = 4
                    duration = duration*4
                } else if (duration < .2) {
                    simultaneousLines = 2
                    duration = duration*2
                } 

                const timelines = [] as Array<Promise<boolean>>
                gsap.killTweensOf(lines)
                lines.forEach((line, index) => {
                    timelines.push(new Promise((resolve2) => {
                        const tl = gsap.timeline()
                        tl.to(line, {
                            drawSVG: "0.01%",
                            ease: "power2.out",
                            opacity: 0,
                            strokeWidth: this.strokeWidth / 2,
                            // strokeLinecap: "round",
                            duration: animate ? duration : 0,
                            delay: animate ? Math.ceil(index/simultaneousLines) * .08 : 0,
                            onComplete: () => {
                                setTimeout(() => {
                                    resolve2(true)
                                }, animate ? 240 : 0)
                            }
                        })
                    }))
                })

                Promise.all(timelines).then(() => {
                    resolve(true)
                })
                // Promise.all(timelines).then(() => {
                //     if (!animate) {
                //         return resolve(true)
                //     }
                //     const svgContainer = this.$refs["vpgSVG"] as HTMLElement
                //     if (!svgContainer) return
                //     const children =  svgContainer.querySelectorAll(".vpg-line")
                //     if (children.length > 0) {
                //         for (let i = 0; i < children.length; i++) {
                //             const parentNode = children[i].parentNode
                //             if (parentNode) {
                //                 parentNode.removeChild(children[i])
                //             }
                //         }
                //     }
                //     resolve(true)
                // })
            })
        },

        showLine(polylineIndex: number) {
            const polylines = this.$refs.polyline as Array<HTMLElement>
            if (!polylines) {
                return
            }
            
            gsap.to(polylines[polylineIndex], {
                opacity:1,
                ease: "power4.inOut",
                duration: .4
            })
        },
        hideLine(polylineIndex: number) {
            if (!this.app.editMode) {
                return
            }
            const polylines = this.$refs.polyline as Array<HTMLElement>
            if (!polylines || !this.vpgPattern) {
                return
            }

            gsap.to(polylines[polylineIndex], {
                opacity:.5,
                ease: "power4.inOut",
                duration: .4
            })
        },
        removeLine(polylineElement: HTMLElement) {
            const el = this.$el as HTMLElement
            
            if (!this.vpgPattern || !el || !polylineElement || polylineElement.classList.contains("__isRemoved")) {
                return
            }
            // The division of removing and animating the removal is necessary
            // The update of the domElements of Vue, will transfer the animation to a "random" other element if it wouldn't be done in this way
            
            this.manualUpdate = true
            
            _.remove(this.vpgPattern?.polylines, polyline => {
                const x1 = parseInt(polylineElement.getAttribute("dataX1") || "777", 10) - this.offset.x
                const y1 = parseInt(polylineElement.getAttribute("dataY1") || "777", 10) - this.offset.y
                const x2 = parseInt(polylineElement.getAttribute("dataX2") || "777", 10) - this.offset.x
                const y2 = parseInt(polylineElement.getAttribute("dataY2") || "777", 10) - this.offset.y
                const matchedPolyline =  (polyline[0].x == x1 && polyline[1].x == x2 && polyline[0].y == y1 && polyline[1].y == y2)
                
                if (this.phygital.mirroredEdit && matchedPolyline){
                    const oppositeSurface = this.phygital.getOppositeSurface(this.app.activeSurface)
                    if (oppositeSurface) {
                        _.remove(this.phygital.surfaces[oppositeSurface].polylines, mirroredPolyline => {
                            return (mirroredPolyline[0].x == x1 && mirroredPolyline[1].x == x2 && mirroredPolyline[0].y == y1 && mirroredPolyline[1].y == y2)
                        })
                    }
                }

                return matchedPolyline
            })
            this.phygital.seed = "custom"
            
            gsap.killTweensOf(polylineElement)
            gsap.set(polylineElement, {opacity: 1})

            const animationElement = polylineElement.cloneNode(true) as SVGPolylineElement
            animationElement.classList.add("__isRemoved")
            // animationElement.style.stroke = "#f09" // Simplify debugging
            const patternGroup = el.querySelector("svg .vpg-pattern")
            patternGroup?.appendChild(animationElement)

            setTimeout(() => {
                const centerX = (animationElement.points[0].x + animationElement.points[1].x) /2
                const centerY = (animationElement.points[0].y + animationElement.points[1].y) /2
                animationElement.setAttribute("data-svg-origin", `${centerX} ${centerY}`)
                
                gsap.to(animationElement, {
                    opacity: 0,
                    duration: .32,
                    scale: 1.44,
                    ease: "power3,out",
                    onComplete: () => {
                        if (!patternGroup) {
                            return
                        }
                        patternGroup.removeChild(animationElement)
                    }
                })
            })
        },
        startNewLine(posX: number, posY: number) {
            let height = 0
            let width = 0
            if (!this.vpgPattern) {
                return "startNewLine(): Missing vpgPattern"
            }

            if (!posX || !posY) return
            const centerPoint = this.$el.querySelector(`.grid-point[dataX="${posX}"][dataY="${posY}"]`) as HTMLElement
            const topPoint = this.$el.querySelector(`.grid-point[dataX="${posX}"][dataY="${posY - 1}"]`) as HTMLElement
            const bottomPoint = this.$el.querySelector(`.grid-point[dataX="${posX}"][dataY="${posY + 1}"]`) as HTMLElement
            const leftPoint = this.$el.querySelector(`.grid-point[dataX="${posX - 1}"][dataY="${posY}"]`) as HTMLElement
            const rightPoint = this.$el.querySelector(`.grid-point[dataX="${posX + 1}"][dataY="${posY}"]`) as HTMLElement
            

            if (this.app.activeSurface == "bottom") {
                height = this.vpgPattern.height
                width = this.vpgPattern.width
            } else if (this.app.activeSurface == "top") {
                height = this.vpgPattern.height
                width = this.vpgPattern.width
            } else if (this.app.activeSurface == "left") {
                height = this.vpgPattern.height
                width = this.vpgPattern.width
            } else if (this.app.activeSurface == "right") {
                height = this.vpgPattern.height
                width = this.vpgPattern.width
            } else if (this.app.activeSurface == "front") {
                height = this.vpgPattern.height
                width = this.vpgPattern.width
            } else if (this.app.activeSurface == "back") {
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
            
            // const newLine = this.svg.line(
            //     posX*this.cellSize + this.cellSize/2,
            //     posY*this.cellSize+ this.cellSize/2,
            //     posX*this.cellSize + this.cellSize/2,
            //     posY*this.cellSize+ this.cellSize/2
            // )

            // newLine.attr({
            //     class: "new-line",
            //     style: `stroke-width: ${this.strokeWidth}px;
            //             stroke-linecap: round;
            //             opacity: 0.5;
            //             stroke: #1c1c1e;`
            // })
            // this.svg.add(newLine)
            // gridPoint.classList.add("__isActive")
            this.newLine.push({x: posX * this.cellSize + this.cellSize/2, y: posY * this.cellSize + this.cellSize/2})
            this.newLine.push({x: this.mouseX, y: this.mouseY})
        },
        cancelNewLine() {    
            // remove old line
            gsap.killTweensOf(".new-line:not(.__isRemoved)")
            const gridPoints = this.$el.querySelectorAll(".__isOption")
            this.disableNewLine = true
            gridPoints.forEach((gridPoint: SVGAElement)=> {
                gridPoint.classList.remove("__isOption")
            })
            gsap.to(".new-line", {
                opacity: 0,
                duration: .32,
                ease: "power4.out",
                onComplete: () => {
                    this.newLine.length = 0
                    this.disableNewLine = false

                    const removedLines = this.$el.querySelectorAll(".vpg-line.__isRemoved") as Array<HTMLElement>
                    if (removedLines) {
                        removedLines.forEach(line => {
                            line.remove()
                        })
                    }
                }
            })
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
        opacity: 0;

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
        opacity:.72;
        // transition: .32s all ease; // Maybe set only for opacity?
    }
    .inner-ring {
        stroke: #ced1db;
        stroke-width: 1px;
        stroke-dasharray: 3.2 1.6;
        fill: transparent;
        opacity: 0;
        // transition: .32s all ease; // Maybe set only for opacity?
    }

    .line-vertical,
    .line-horizontal {
        opacity: 0;
        stroke-width: 2px;
        stroke: #2d2e33;
        scale: .8;
        stroke-linecap: round;  
        // transition: .32s all ease; // Maybe set only for opacity?
    }

    .new-line {
        stroke-linecap: round;
        opacity: 0.5;
        stroke: #1c1c1e;
    }
    
    .center-ring {
        fill: transparent;
    }
}

</style>
