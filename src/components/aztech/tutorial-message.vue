<template>
    <div class="aztech-tut-messsage">
        <div class="aztech-tut-messsage-container" >

            <span class="aztech-tut-message-text-container">
                <span class="aztech-tut-message-text" :class="[
                    direction == 'tl' ? '__isTopLeft' : '',
                    direction == 'tr' ? '__isTopRight' : '',
                    direction == 'bl' ? '__isBottomLeft' : '',
                    direction == 'br' ? '__isBottomRight' : '',
                ]">
                    <slot />
                </span>
            </span>
    
            <svg class="aztech-tut-line" v-if="line.length" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" :viewBox="`0 0 ${line.width} ${line.height}`" :style="`enable-background:new 0 0 ${line.width} ${line.height}; width: ${line.width}px`" xml:space="preserve">
                <polyline :points="line.points.join(' ')"/>
                <circle class="point" cx="3" cy="3" r="3"/>
                <g v-if="direction == 'tl'">
                    <!-- <path d="M1,0.2c-0.6,0-1,0.4-1,1c0,0.6,0.4,1,1,1c0.6,0,1-0.4,1-1C2,0.7,1.6,0.2,1,0.2L1,0.2z"/> -->
                    <!-- <polyline points="38,28.8 34,28.8 7,1.2 1,1.2 	"/> -->
                </g>
            </svg>
            <svg class="aztech-tut-dot" @mouseenter="mouseEnterEvent" @mouseleave="mouseLeaveEvent" @click="openMessage" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 31 31" style="enable-background:new 0 0 31 31;" xml:space="preserve">
                <circle class="outer-circle" cx="15.5" cy="15.5" r="14.5"/>
                <circle class="dot" cx="15.5" cy="15.5" r="8"/>
                <circle class="inner-circle" cx="15.5" cy="15.5" r="11" />
            </svg>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import gsap from "gsap"


export default defineComponent({
    name: "aztech-tutorial-message",
    props: {
        direction: {
            type: String,
            default: "tl" // as "tl" | "tr" | "bl" | "br" (tl = top-left, tr = top-right etc..)
        },
        openAutomatically: {
            default: false
        }
    },
    data: () => {
        return {
            line: {
                points: [] as Array<string>,
                width: 0,
                height: 0,
                length: 0,
            },
            messageOpen: false,
            timestampEntered: new Date(),
            openingTimeout: 0 as timeout
        }
    },
    watch: {
        messageOpen() {
            if (this.messageOpen) {
                window.addEventListener("click", this.clickedOutside)
            }
        }
    },
    methods: {
        defineLine() {
            const message = this.$el.querySelector(".aztech-tut-message-text-container")?.getBoundingClientRect()
            const dot = this.$el.querySelector(".aztech-tut-dot")?.getBoundingClientRect()

            
            this.line.height = Math.round(Math.abs((message.y + message.height/2) - (dot.y + dot.height/2))) + 4
            this.line.width = Math.round(Math.abs((message.x + message.width) - dot.x - dot.width/2 )) + 4

            this.line.points = []
            this.line.points.push(`${this.line.width} ${this.line.height }`)
            this.line.points.push("12 3")
            this.line.points.push("2 3")
            this.line.length = this.calculateLineLength(this.line.points)


        },
        calculateLineLength(coordinates: Array<string>) {
            let totalLength = 0

            for (let i = 0; i < coordinates.length - 1; i++) {
                const currentCord = coordinates[i].split(" ")
                const nextCord = coordinates[i + 1].split(" ")
                const x1 = parseInt(currentCord[0], 10)
                const y1 = parseInt(currentCord[1], 10)
                const x2 = parseInt(nextCord[0], 10)
                const y2 = parseInt(nextCord[1], 10)

                const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
                totalLength += distance
            }

            return totalLength
        },
        clickedOutside(e: MouseEvent) {
            const target = e.target as HTMLElement
            let element = target
            if (target.classList.contains("aztech-tut-messsage")) {
                return
            }
            while(element.parentElement) {
                if (element.classList.contains("aztech-tut-messsage")) {
                    return
                }
                element = element.parentElement
            }

            this.closeMessage()
        },
        mouseEnterEvent(e: MouseEvent) {
            this.defineLine()
            const dot = this.$el.querySelector(".aztech-tut-dot .dot")
            this.timestampEntered = new Date()

            this.openingTimeout = setTimeout(() => {
                this.openMessage(e)
            }, 240)

            const tl = gsap.timeline({ repeat: -1 })
            tl.to(dot, {
                fill: "#000",
                ease: "power2.out",
                duration: .64,
            })
            tl.to(dot, {
                fill: "transparent",
                ease: "power2.in",
                duration: .64,
            })
            tl.to(dot, {
                fill: "#000",
                ease: "power2.out",
                duration: .64,
            })
            tl.to(dot, {
                fill: "transparent",
                ease: "power2.in",
                duration: .64,
            })
        },
        mouseLeaveEvent(e: MouseEvent) {
            const timestamp = new Date()
            const timeDifferenceInMillis = timestamp.getTime() - this.timestampEntered.getTime()
            const timeDifferenceInSeconds = timeDifferenceInMillis / 1000

            clearTimeout(this.openingTimeout)
            if (timeDifferenceInSeconds > 2.4) {
                this.closeMessage()
            }

            const dot = this.$el.querySelector(".aztech-tut-dot .dot")
            gsap.killTweensOf(dot)

            gsap.to(dot, {
                fill: "transparent",
                ease: "power3.inOut",
                duration: .4,
            })

            const innerCircle = this.$el.querySelector(".aztech-tut-dot .inner-circle")
            gsap.killTweensOf(innerCircle)
            gsap.to(innerCircle, {
                rotate: 0,
                x:0,
                y:0,
                ease: "none",
                duration: .4
            })
            
            
        },
        closeMessage() {
            this.messageOpen = false
            const tutLine = this.$el.querySelector(".aztech-tut-line")
            const tutLinePolyline = this.$el.querySelector(".aztech-tut-line polyline")
            const tutLinePoint = this.$el.querySelector(".aztech-tut-line circle")
            
            const innerCircle = this.$el.querySelector(".aztech-tut-dot .inner-circle")
            gsap.killTweensOf(innerCircle)
            gsap.to(innerCircle, {
                rotate: 360,
                transformOrigin:"50% 50%",
                ease: "power4.inOut",
                duration: 1.8,
                onComplete: () => {
                    gsap.set(innerCircle, {rotation: 0})
                }
            })

            gsap.to(tutLinePolyline, {
                duration: .64,
                strokeDashoffset: this.line.length,
                delay: .96,
                ease: "power2.out",
                onComplete: () => {
                    gsap.set(tutLine, {opacity: 0})
                }
                
            })
            gsap.to(tutLinePoint, {
                // delay: 0,
                scale: 0,
                delay: .32,
                duration:.48,
                ease: "none",
                onComplete: () => {
                    gsap.set(tutLinePoint, {opacity: 0})
                }
            })

            const message = this.$el.querySelector(".aztech-tut-message-text-container")
            const width = message.clientWidth
            const height = message.clientHeight

            gsap.to(message, {
                opacity: 0,
                ease: "power4.inOut",
                duration: .16,
                delay:.8,
                onComplete: () => {
                    gsap.to(message, {
                        width: Math.round(width+2),
                        height: Math.round(height+2),
                        y:0,
                    })
                }
            })

            gsap.to(message, {
                width: 0,
                ease: "power2.in",
                duration: .64,
                delay:.4,
            })
            // delay:1

            gsap.to(message, {
                height: 2,
                y: Math.round(-height/2) + 1,
                ease: "power2.in",
                duration: .64,
            })
        },
        openMessage(e: MouseEvent) {
            if (this.messageOpen) {
                // this.closeMessage()
                return
            }

            this.defineLine()
            this.messageOpen = true


            const dot = this.$el.querySelector(".aztech-tut-dot .dot")
            gsap.killTweensOf(dot)
            gsap.to(dot, {
                opacity: 1,
                ease: "power3.inOut",
                duration: .4,
            })

            const innerCircle = this.$el.querySelector(".aztech-tut-dot .inner-circle")
            gsap.killTweensOf(innerCircle)
            gsap.to(innerCircle, {
                rotate: -360,
                transformOrigin:"50% 50%",
                ease: "none",
                duration: 1.28,
                onComplete: () => {
                    gsap.set(innerCircle, {rotation: 0})
                }
            })
            
            
            this.$nextTick(() => {
                
                const tutLine = this.$el.querySelector(".aztech-tut-line")
                const tutLinePolyline = this.$el.querySelector(".aztech-tut-line polyline")
                const tutLinePoint = this.$el.querySelector(".aztech-tut-line circle")
                gsap.killTweensOf(tutLine)
                gsap.killTweensOf(tutLinePolyline)
                gsap.killTweensOf(tutLinePoint)
            
            
                gsap.set(tutLine, {
                    opacity: 1
                })
                gsap.set(tutLinePolyline , {
                    strokeDasharray: this.line.length,
                    strokeDashoffset: this.line.length,
                })
                gsap.set(tutLinePoint, {
                    scale: 0,
                    opacity: 1,
                    transformOrigin: "50% 50%"
                })


                gsap.to(tutLinePolyline, {
                    duration: .64,
                    strokeDashoffset: 0,
                    delay: 0,
                    ease: "power2.out",
                
                })
                gsap.to(tutLinePoint, {
                    delay: 1,
                    scale: 1,
                    duration:.48,
                    ease: "none"
                })

                const message = this.$el.querySelector(".aztech-tut-message-text-container")
                const width = message.clientWidth
                const height = message.clientHeight
                gsap.set(message, {
                    width: 2,
                    height: 2,
                    y: Math.round(-height/2) + 1
                })

                gsap.to(message, {
                    opacity: 1,
                    ease: "power4.inOut",
                    duration: .16,
                    delay:.4
                })

                gsap.to(message, {
                    width: width,
                    ease: "power4.inOut",
                    duration: .64,
                    delay:.4
                })

                gsap.to(message, {
                    height: Math.round(height) + 2,
                    y: 0,
                    ease: "power4.inOut",
                    duration: .64,
                    delay:1
                })
            })
        },
    }
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.aztech-tut-messsage-container {
    position: relative;
    display: inline-block;
}

.aztech-tut-message-text-container {
    overflow: hidden;
    position: absolute;
    right: 56px;
    bottom: 24px;
    display: block;
    border: 1px solid $black;
    opacity: 0;
}

.aztech-tut-message-text {
    display: block;
    background-color: #fff;
    font-size: 12px;
    font-family: $defaultFont;
    width: 148px;
    padding: 8px;
}
.aztech-tut-line {
    position: absolute;
    display: block;
    z-index: 1;
    translate: -35px -31px;
    top: 0;
    left: 0;
    opacity: 0;

    polyline {
        stroke: $black;
        stroke-width: 2px;
        fill: none;
    }
}
.aztech-tut-dot {
    width: 24px;
    height: 24px;
    display: block;
    position: relative;
    z-index: 1;
    
    .dot { 
        // opacity: 0;
        fill: transparent;
    }

    .inner-circle {
        stroke: $black;
        stroke-dasharray:6,2;
        stroke-width: 2;
        fill: none;
    }
    .outer-circle {
        stroke: $black;
        stroke-width: 2;
        fill:#eee;
    }
}
.dot-test {
    background-color: $black;
    border-radius: 100%;
    position: fixed;
    top: 64px;
    left: 64px;
    width: 32px;
    height: 32px;
}
</style>