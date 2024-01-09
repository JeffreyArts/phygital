<template>
    <div class="seed-section-container" ref="container">
        <label class="seed-container">
            <span class="seed-value">
                {{ seed }}
                <span class="seed-label-container">
                    <AztechUnderline label="seed" :slots="slots" />
                </span>
            </span>
            
            <icon type="loader" class="seed-button" label="regenerate" ref="generateButton" @click="regenerateSeed"/>
        </label>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import icon from "@/components/icon.vue"
import AztechUnderline from "@/components/aztech/underline-1.vue"
import gsap from "gsap"
import _ from "lodash"
import App from "@/stores/app"
import { phygitalSeedEvent } from "@/stores/phygital"
import Phygital from "@/stores/phygital"
import { runInThisContext } from "vm"

export default defineComponent({
    name: "cube-seed",
    components: {
        icon, AztechUnderline
    },
    props: {
        character: {
            type: String,
            required: false,
            default: "-"
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
            regenerating: false,
            seed: "a-" +_.random(100000, 999999).toString(),
            slots: 2,
            seedGenerationInterval: 0 as number | timeout
        }
    },
    computed: {
        line() {
            return this.character.repeat(512)
        },
        width() {
            return this.phygital.surfaces.top.width * this.phygital.blockSize
        },
        height() {
            return this.phygital.surfaces.left.height * this.phygital.blockSize
        },
        depth() {
            return this.phygital.surfaces.top.height * this.phygital.blockSize
        }
    },
    watch: {
        "phygital.seed"(value) {
            if (value == "custom" && this.seed != "custom") {
                this.seed = "custom"
            } else {
                this.seed = value
            }
        }
    },
    mounted() {

        if (window.innerWidth> 512) {
            this.slots = 4
        } else {
            this.slots = 1
        }
        this.phygital.setSeed(this.seed)
        window.addEventListener("phygital:seed", this.seedChange)
        
        // this.phygital.generateDimensions()
        // this.updateSurfaces()
        // this.seed = this.phygital.seed + ""

        // this.mountedAnimations()
        
        window.addEventListener("resize", this.resizeEvent)
        // window.addEventListener("appState:sidebar", this.handleAppState)
        // window.addEventListener("appState", this.handleAppState)
    },
    methods: {
        seedChange(e : Event) {
            const event = e as phygitalSeedEvent
            console.log(event.detail)
            if (event.detail == "changed") {
                // Update the data and finish animations
                clearInterval(this.seedGenerationInterval)
                this.seed = this.phygital.seed

                if (!this.$refs["generateButton"]) {
                    return
                }

                const currentTarget = this.$refs["generateButton"].$el

                if (!currentTarget) {
                    return
                }

                const target = currentTarget.querySelector("g")
                // kill slots animation
                gsap.killTweensOf(target)
                gsap.to(target, {
                    duration: .64,
                    rotate: 560,
                    ease: "elastic.out(1, .4)",
                })

                setTimeout(() => {
                    gsap.killTweensOf(this)
                    gsap.to(this, {
                        slots: 4,
                        duration: .8,
                    })
                    this.regenerating = false
                    currentTarget.classList.remove("__isGenerating")
                    gsap.set(target, {rotate: 0})
                    // console.log("A")
                    // App.activated()
                }, 0)
            }
        },
        resizeEvent(e) {

            if (window.innerWidth> 512) {
                this.slots = 4
            } else {
                this.slots = 1
            }
        },
        handleAppState(event: CustomEvent) {
            // console.log(event)
            if (event.detail == "activated") {
                
            }
        },
        mountedAnimations() {
            gsap.set(".aztech-underline-1-slot", {
                opacity: 0,
                x: 2
            })

            setTimeout(() => {
                gsap.to(this.$el.querySelector(".seed-button g"), {
                    duration: 1.64,
                    rotate: 1280,
                    ease: "elastic.inOut(1, 0.4)",
                })

                gsap.to(".aztech-underline-1-slot", {
                    duration: .8,
                    stagger: .02,
                    opacity: 1,
                    delay: .32,
                    x:0,
                    ease: "power2.out",
                })
            })
        },
        regenerateSeed(event:MouseEvent) {
            const currentTarget = event.currentTarget as HTMLElement
            const newSeed = "a-" +_.random(0, 1000000).toString()

            if (this.regenerating) { 
                return
            }

            if (!currentTarget) {
                return
            }

            this.regenerating = true


            currentTarget.classList.add("__isGenerating")
            const target = currentTarget.querySelector("g")
            let maxSlots = 4
            if (window.innerWidth> 360) {
                maxSlots = 6
            } else if (window.innerWidth> 512) {
                maxSlots = 8
            }
            const slotsAnimation = gsap.to(this, {
                duration: 2.2,
                ease: "power2.out",
                slots: maxSlots,
            })



            this.seedGenerationInterval = setInterval(() => {
                this.seed = "a-" +_.random(0, 1000000).toString()
            }, 64)

            gsap.to(target, {
                duration: 1.28,
                rotate: 360,
                repeat: -1,
                ease: "none",
            })
            
            this.phygital.updateSeed(newSeed)
            
            
        },
        
        updateSurfaces() {
            this.phygital.processSeed().then(() => {
                this.phygital.update3DSurface("top")
                this.phygital.update3DSurface("bottom")

                this.phygital.update3DSurface("left")
                this.phygital.update3DSurface("right")

                this.phygital.update3DSurface("front")
                this.phygital.update3DSurface("back")
                setTimeout(() => {
                    App.activate()
                    
                }, 1000)
            }) 
        },
        modifyBlockSize(size: number) {
            this.phygital.blockSize = size/this.phygital.surfaces.top.width 
        }
    }
})
</script>

<style lang="scss">
@import "@/assets/scss/variables.scss";
.seed-section-container {
    position: relative;
    display: flex;
    flex-flow: column;
    padding: 0;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    container-type: size;
    container-name: seed-section-container;
}

.seed-container {
    // margin-top: 12px;
    height: 100%;
    font-family: $accentFont;
    display: flex;
    gap: 8px;
    color: $black;
    position: relative;
    justify-content: space-between;
    align-items: center;
}

.seed-label-container {
    // margin-top: 8px;
    display: none;
    
    svg {
        width: 100%;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        min-height: 6px;
    }
    .seed-label {
        margin-right: 10px;
        font-weight: normal;
        margin-bottom: 1px;
    }
}

.seed-name {
    font-weight: normal;
}

.seed-value {
    width: calc(100% - 32px);
    font-size: 14px;
    text-align: left;
    position: relative;
}


.seed-button {
    // height: 100%;
    // height: 52px;
    // width: 88px;
    width: 32px;
    // translate: 8px 0px;
    cursor: pointer;
    .icon-svg {
        height: 24px;
    }
    svg {
        display: inline-block;
        transition: .4s all ease;
        width: 100%;
        g {
            transform-origin: center center;
        }
    }

    &:hover {
        svg {
            rotate: -45deg;
        }
        .icon-label {
            opacity: 1;
        }

        &.__isGenerating {
            // pointer-events: none;
            cursor: wait;
            .icon-label {
                opacity: 0;
            }   
        }
    }
    

    .icon-label {
        opacity: 0;
        display: none;
        font-size: 10px;
        transition: .24s opacity ease;
    }
}

@container seed-section-container (min-height: 44px) {
    .seed-value {
        font-size: 10px;
    }
}

@container seed-section-container (min-height: 60px) {
    .seed-value {
        font-size: 12px;
    }
}

@container seed-section-container (min-height: 70px) {
    .seed-value {
        font-size: 14px;
        width: calc(100% - 32px); 
    }
    .seed-button {
        width: 32px;
        .icon-svg {
            height: 24px;
        }
    }
}

@container seed-section-container (min-height: 76px) {
    .seed-value {
        text-align: right;
        font-size: 16px;
    }
    .seed-label-container {
        display: block;
    }
    .seed-button {
        translate: 0 -8px;
    }
}

@container seed-section-container (min-height: 84px) {
    .seed-label-container {
        margin-top: 4px;
    }
    .seed-value {
        // font-size: 18px;
    }
}

@container seed-section-container (min-height: 96px) {
    .seed-label-container {
        margin-top: 8px;
    }
    .seed-value {
        margin-top: 12px;
        width: calc(100% - 88px); 
    }
    .seed-button {
        height: 48px;
        width: 88px; 
        translate: 0 0;

        .icon-svg {
            height: 36px;
        }
        .icon-label {
            display: block;
            // font-family: $defaultFont;
        }
    }
}
</style>
