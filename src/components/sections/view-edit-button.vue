<template>
    <div class="view-edit" >
        <div class="view-edit-container" :class="[editMode ? '__isEdit' : '__isView']" ref="container" @click="switchMode" @mouseenter="wink">
            <svg class="view-edit-hand-icon" :class="editMode ? '' : '__isVisible'" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 37 64" style="enable-background:new 0 0 37 64;" xml:space="preserve">
                <path id="hand" d="M30.925,11.035v18.758h-1.657V4.414h-6.073v25.379h-1.657V0h-6.075v29.793h-1.657V3.31H7.732 v35.863H6.075v-19.31H0v25.654C0,55.718,8.289,64,18.5,64S37,55.718,37,45.517V11.035H30.925z M23.645,52.125H13.207L9.32,48.147 l4.057-4.022h10.268l4.035,4L23.645,52.125z"/>
                <path id="eye-open" style="display:none" d="M30.925,11.035v18.758h-1.657V4.414h-6.073v25.379h-1.657V0h-6.075v29.793h-1.657V3.31H7.732 v35.863H6.075v-19.31H0v25.654C0,55.718,8.289,64,18.5,64S37,55.718,37,45.517V11.035H30.925z M23.645,52.125H13.207L9.32,48.147 l4.057-4.022h10.268l4.035,4L23.645,52.125z"/>
                <path id="eye-closed" style="display:none" d="M30.925,11.035v18.758h-1.657V4.414h-6.073v25.379h-1.657V0h-6.075v29.793h-1.657V3.31H7.732 v35.863H6.075v-19.31H0v25.654C0,55.718,8.289,64,18.5,64S37,55.718,37,45.517V11.035H30.925z M26.394,49.399H10.5l-1.18-1.252 l1.18-1.154h16.038l1.142,1.131L26.394,49.399z"/>
                <path id="gear" style="display:none" d="M30.92,11.03v18.76h-1.66V4.41H23.2v25.38h-1.66V0h-6.08v29.79h-1.66V3.31H7.73v35.86H6.08V19.86H0v25.65 C0,55.72,8.29,64,18.5,64S37,55.72,37,45.52V11.03H30.92z M26.44,49.21l-2.04,0.58c-0.14,0.51-0.34,1-0.6,1.45l1.03,1.85 c0,0-0.33,0.42-0.67,0.76c-0.34,0.35-0.76,0.67-0.76,0.67l-1.85-1.03c-0.45,0.26-0.93,0.46-1.45,0.6l-0.58,2.04 c0,0-0.53,0.06-1.02,0.06s-1.02-0.06-1.02-0.06l-0.58-2.04c-0.51-0.14-1-0.34-1.45-0.6l-1.85,1.03c0,0-0.42-0.33-0.76-0.67 c-0.35-0.34-0.67-0.76-0.67-0.76l1.04-1.85c-0.26-0.45-0.46-0.93-0.6-1.45l-2.04-0.58c0,0-0.06-0.53-0.06-1.02s0.06-1.02,0.06-1.02 l2.04-0.58c0.14-0.51,0.34-1,0.6-1.45l-1.04-1.85c0,0,0.33-0.42,0.67-0.76c0.34-0.35,0.76-0.67,0.76-0.67l1.85,1.04 c0.45-0.26,0.93-0.46,1.45-0.6l0.58-2.04c0,0,0.53-0.06,1.02-0.06s1.02,0.06,1.02,0.06l0.58,2.04c0.51,0.14,1,0.34,1.45,0.6 l1.85-1.04c0,0,0.42,0.33,0.76,0.67c0.34,0.34,0.67,0.76,0.67,0.76l-1.04,1.85c0.26,0.45,0.46,0.93,0.6,1.45l2.04,0.58 c0,0,0.06,0.53,0.06,1.01S26.44,49.21,26.44,49.21z"/>
                
                <g id="eye-pupil">
                    <circle class="outer-ring" cx="18.5" cy="48.197" r="4"/>
                    <circle class="inner-ring" cx="18.5" cy="48.197" r="2.5"/>
                </g>
            </svg>
            
            
            <svg class="view-edit-deco-top-left" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 45.5 16" style="enable-background:new 0 0 45.5 16;" xml:space="preserve">
                <g id="fill">
                    <path id="fill-1" d="M6.5,0H0v8h0.14L6.5,1.46V0L6.5,0z"/>
                    <path id="fill-2" d="M26,0H14.48L0,14.59V16h11.35L26,1.24V0L26,0z"/>
                    <path id="fill-3" d="M45.5,0H33.98L19.5,14.59V16h11.35L45.5,1.24V0L45.5,0z"/>
                </g>
                
                <g id="outline">
                    <path id="outline-1" d="M44.33,1l-13.9,14H20.5l0,0L34.4,1H44.33 M45.5,0H33.98L19.5,14.59V16h11.35L45.5,1.24V0L45.5,0z"/>
                    <path id="outline-2" d="M24.83,1l-13.9,14H1l0,0L14.9,1H24.83 M26,0H14.48L0,14.59V16h11.35L26,1.24V0L26,0z"/>
                    <path id="outline-3" d="M5.5,1v0.05L1,5.68V1H5.5 M6.5,0H0v8h0.14L6.5,1.46V0L6.5,0z"/>
                </g>
            </svg>
            
            <svg class="view-edit-deco-bottom-right" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 51 22" style="enable-background:new 0 0 51 22;" xml:space="preserve">
                <g id="outline">
                    <path id="outline-4" d="M44.11,0L23.43,20.62V22h6.89L46.98,5.38l2.64,0.12L51,4.12V0H44.11z M50,3.71l-0.77,0.77 l-2.2-0.1l-0.44-0.02l-0.31,0.31L29.91,21h-5.44L44.52,1H50V3.71z"/>
                    <path id="outline-3" d="M32.39,0L11.72,20.62V22h6.89L39.28,1.38V0H32.39z M18.2,21h-5.44L32.8,1h5.44L18.2,21z"/>
                    <path id="outline-2" d="M20.68,0L4.14,16.5H1.38L0,17.88V22h6.89L27.57,1.38V0H20.68z M6.48,21H1v-2.71l0.79-0.79h2.76 l0.29-0.29L21.09,1h5.44L6.48,21z"/>
                    <path id="outline-1" d="M5.17,0C2.32,0,0,2.31,0,5.16s2.32,5.16,5.17,5.16c2.85,0,5.17-2.31,5.17-5.16S8.02,0,5.17,0z M5.17,9.31C2.87,9.31,1,7.45,1,5.16C1,2.86,2.87,1,5.17,1s4.17,1.86,4.17,4.16C9.34,7.45,7.47,9.31,5.17,9.31z"/>
                </g>
                <g id="fill">
                    <polygon id="fill-4" points="51,0 44.11,0 23.43,20.62 23.43,22 30.32,22 46.99,5.38 49.62,5.5 51,4.12 51,0 	"/>
                    <path    id="fill-3" d="M32.39,0L11.72,20.62V22h6.89L39.28,1.38V0H32.39z"/>
                    <polygon id="fill-2" points="20.68,0 4.14,16.5 1.38,16.5 0,17.88 0,22 6.89,22 27.57,1.38 27.57,0 	"/>
                    <path    id="fill-1" d="M5.17,0C2.32,0,0,2.31,0,5.16s2.32,5.16,5.17,5.16S10.34,8,10.34,5.16S8.02,0,5.17,0L5.17,0z"/>
                </g>
            </svg>
            
            
            
            
            <div class="view-edit-text-container">
                <span class="view-edit-text" ref="edit-text">View</span>
                <span class="view-edit-text" ref="view-text">Edit</span>
            </div>
        </div>
        
        <aztech-tut-message class="view-edit-tut" open-automatically>
            Click on the hand to toggle the edit mode on or off
        </aztech-tut-message>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import PhygitalStore from "@/stores/phygital"
import AppStore from "@/stores/app"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
import AztechTutMessage from "@/components/aztech/tutorial-message.vue"
import gsap from "gsap"

export default defineComponent({
    name: "view-edit-button",
    components: {
        AztechTutMessage,
    },
    setup() {
        const phygital = PhygitalStore()
        const app = AppStore()
        return {
            phygital, app
        }
    },
    data: () => {
        return {
            editMode: false,
            editModeVisible: true,
            viewModeVisible: false,
            
        }
    },
    computed: {
    },
    mounted() {
        gsap.registerPlugin(MorphSVGPlugin)
        this.editMode = this.app.editMode        
        
        const viewEl = this.$refs["view-text"] as HTMLElement
        const editEl = this.$refs["edit-text"] as HTMLElement
        if (!viewEl || !editEl) return
        
        if (this.editMode) {
            gsap.set(editEl, {opacity: 1, x: 0})
            gsap.set(viewEl, {opacity: 0, x: -16})
            gsap.set("#hand", {morphSVG: "#gear"})
            gsap.set(".view-edit-deco-bottom-right #fill > *", {fill: "#1c1c1e"})
            gsap.set(".view-edit-deco-top-left #fill > *", {fill: "#1c1c1e"})
        } else {
            // gsap.set(viewEl, {opacity: 1, x: 0})
            gsap.set(editEl, {opacity: 0, x: -16})
            gsap.set("#hand", {morphSVG: "#eye-open"})
            gsap.set(".view-edit-deco-bottom-right #fill > *", {fill: "transparent"})
            gsap.set(".view-edit-deco-top-left #fill > *", {fill: "transparent"})
            setTimeout(this.wink, 1000)
        }
    }, 
    methods: {
        switchMode() {
            this.app.editMode = !this.app.editMode
            this.editMode = this.app.editMode
            
            const viewEl = this.$refs["view-text"] as HTMLElement
            const editEl = this.$refs["edit-text"] as HTMLElement
            if (!viewEl || !editEl) return
            
            // kill any existing tweens
            gsap.killTweensOf("#hand")
            gsap.killTweensOf(".view-edit-deco-bottom-right #fill > *")
            gsap.killTweensOf(".view-edit-deco-top-left #fill > *")
            
            
            // Animate text
            if (this.editMode) {
                this.animateText(editEl,viewEl)
                // gsap.set("#hand", {morphSVG: "#eye-open"})
                gsap.to("#hand", {morphSVG: "#gear", duration: 0.3})
                
                gsap.to(".view-edit-deco-bottom-right #fill > *", {
                    fill: "#1c1c1e",
                    duration: 0.32,
                    stagger: 0.08
                })
                gsap.to(".view-edit-deco-top-left #fill > *", {
                    fill: "#1c1c1e",
                    duration: 0.48,
                    stagger: 0.08
                })
            } else {
                // gsap.set("#hand", {morphSVG: "#eye-closed"})
                gsap.to("#hand", {
                    morphSVG: "#eye-closed", 
                    duration: 0.3, 
                    onComplete: () => {
                        gsap.to("#hand", {morphSVG: "#eye-open", duration: 0.3, delay:.08})
                    }
                })
                this.animateText(viewEl, editEl)
                gsap.to(".view-edit-deco-bottom-right #fill > *", {
                    fill: "transparent",
                    duration: 0.48,
                    stagger: {
                        each: 0.08,
                        from: "end",
                    }
                })
                gsap.to(".view-edit-deco-top-left #fill > *", {
                    fill: "transparent",
                    duration: 0.32,
                    stagger: {
                        each: 0.08,
                        from: "end",
                    }
                })
            }
        },
        wink(){
            if (!this.editMode) {
                const tl = gsap.timeline()
                tl.to("#hand", {morphSVG: "#eye-closed", duration: 0.3})
                    .to("#hand", {morphSVG: "#eye-open", duration: 0.3, delay:.16})
            }
        },
        animateText(el1:HTMLElement, el2:HTMLElement) {
            // Animate text
            gsap.set(el1, {opacity: 0, x: -16})
            gsap.to(el2, {
                duration: 0.48,
                opacity: 0,
                x: -16,
                onComplete: () => {
                    gsap.set(el2, {x: 0})
                }
            })
            gsap.to(el1, {
                duration: 0.48,
                opacity: 1,
                x: 0,
            })
        }
    }
})
</script>

<style lang="scss">
@import "@/assets/scss/variables.scss";
.view-edit {
    position: relative;
    width: 100%;
    height: 100%;
}

.view-edit-container {
    position: relative;
    width: 100%;
    height: 100%;
    container-type: size;
    container-name: view-edit-container;
}

.view-edit-text-container {
    opacity: 0;
}

.view-edit-text {
    position: absolute;
    left: 0;
    bottom: 0;
    font-family: $defaultFont;
    font-weight: normal;
    line-height: 16px;
    font-size: 16px;
    height: 14px;
}

.view-edit-hand-icon {
    height: calc(100% - 20px);
    position: absolute;
    left: 50%;
    margin-top: 2px;
    transform: translateX(-50%);
}

.view-edit-deco-top-left {
    position: absolute;
    top: 0; 
    left: 0;
    height: 8px;
}
.view-edit-deco-bottom-right {
    position: absolute;
    bottom: 0; 
    right: 0;
    height: 14px;
}

.view-edit-tut {
    position: absolute;
    right: 8px;
    top: -16px;
}

@container view-edit-container (min-width: 128px) {
    .view-edit-deco-top-left {
        height: 10px;
    }
    .view-edit-deco-bottom-right {
        height: 16px;
    }
}
@container view-edit-container (min-width: 132px) {
    .view-edit-deco-top-left {
        height: 12px;
    }
    .view-edit-deco-bottom-right {
        height: 18px;
    }
}

</style>
