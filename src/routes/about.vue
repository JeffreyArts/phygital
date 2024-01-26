<template>
    <div class="about-page" ref="container">
        <h1><span>_ </span> about</h1>

        <div class="about-page-offset" >
            
            <p id="section1">Phygital — a blend of the words physical & digital — is an artistic research project in which I explore how a generative computer algorithm can be used to create three-dimensional physical objects. This website — Interphygital — operates as the interface for creating digital three-dimensional sketches and provides me with additional tools to explore the beauty of symmetry in geometry.</p>
            
            <div id="section2" class="about-content">
                <AztechGridCell class="about-content-section">
                    <img src="/images/PT-1128.jpg" />
                </AztechGridCell>
                <AztechGridCell class="about-content-section">
                    <img src="/images/PT-2227.jpg" />
                </AztechGridCell>
                <AztechGridCell class="about-content-section">
                    <img src="/images/PT-2849.jpg" />
                </AztechGridCell>
            </div>

            <p id="section3">With this project, I want to open up my work process to other individuals, cause I believe that (technological) advancements should be made collectively. That is why you are free to use this technology (including its source code) for personal use. If you're interested in what I do and would like to stay up to date on future endeavors or would like to get in touch with me. You can find me online at <a href="https://www.instagram.com/jeffrey.arts/">Instagram</a>, <a href="https://www.jeffreyarts.nl">JeffreyArts.nl</a> or <a href="https://www.artmajeur.com/jeffrey-arts">Artmajeur</a>.</p>
            <p id="section4">Special thanks go out to <a href="https://fontforzula.gumroad.com" target="_blank">fontforzula</a>, who made the visual assets that I have used to create this digital interface. Also special thanks to <a href="https://www.simpleanalytics.com/?referral=huqat">Simple Analytics</a> for providing analytics for this website while respecting your privacy!</p>
            <p id="section5">
                <a href="https://simpleanalytics.com/interphygital.nl?referral=huqat&utm_source=interphygital.nl&utm_content=badge" referrerpolicy="origin" target="_blank"><picture><source srcset="https://simpleanalyticsbadges.com/interphygital.nl?mode=light" media="(prefers-color-scheme: light)" /><img class="simple-analytics-badge" src="https://simpleanalyticsbadges.com/interphygital.nl?mode=light&background=transparent" loading="lazy" referrerpolicy="no-referrer" crossorigin="anonymous" /></picture></a>
            </p>

        </div>
        <div class="bottom-shadow"></div>
        <div class="top-shadow"></div>
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import { RouteLocationNormalized } from "vue-router"
import App from "@/stores/app"
import PhygitalStore from "@/stores/phygital"
import AztechGridCell from "@/components/aztech/grid-cell.vue"
import gsap from "@/services/gsap-wrapper"

export default defineComponent ({ 
    name: "purchaseWork",
    components: {
        AztechGridCell
    },
    props: [],
    setup() {
        const app = App()
        const phygital = PhygitalStore()

        return { app, phygital}
    },
    data() {
        return {
            fadedOut: false,
            open: false,
            isOpen: true,
        }
    },
    computed: {
        isDev() {
            return import.meta.env.DEV
        },
        activeView() {
            return this.app.activeView
        }
    },
    mounted() {
        document.title = "Phygital - About" 
        this.app.activeView = ""

        this.$nextTick(()=> {
            this.fadeIn()
        })

        this.$router.beforeResolve(guard => {
            if (this.$router.currentRoute.value.name != "About" || this.fadedOut) {
                return
            }
            this.fadeOut(guard)
            return false
        })
        // Add scroll event
        const scrollContainer = this.$refs.container as HTMLElement
        if (scrollContainer) {
            scrollContainer.onscroll = this.onScrollEvent
            this.updateShadows(scrollContainer)
        }

    },
    methods: {
        onScrollEvent(e:Event) {
            const target = e.target as HTMLElement
            
            if (!target) {
                return
            }

            this.updateShadows(target) 
        },
        updateShadows(target: HTMLElement) {

            // Set top
            if (target.scrollTop < 1) {
                target.classList.add("__isTop")
            } else {
                target.classList.remove("__isTop")
            }
            // Set bottom
            if (target.scrollTop+ target.offsetHeight + 5 > target.scrollHeight) {
                target.classList.add("__isBottom")
            } else {
                target.classList.remove("__isBottom")
            }
        },
        closeModal() {
            if (!this.isOpen ) {
                return
            }
            this.isOpen = false
            this.$emit("close", false)
        },
        fadeIn(){
            // Title
            const title = this.$el.querySelector("h1").innerText
            if (title) {
                gsap.set(".about-page h1", {
                    text: "",
                    opacity: .2,
                })
                gsap.to(".about-page h1", {
                    text: title,
                    opacity: 1,
                    ease: "none",
                    duration: .64,
                })
            }

            
            // Sections
            gsap.fromTo(".about-page-offset > *",{ 
                opacity: 0,
                x: 56,
                ease: "power1.inOut",
            }, {
                duration: .96,
                stagger: 0.16,
                opacity: 1,
                x: 0,
            })
            
            // Images
            gsap.fromTo(".about-content-section",{ 
                opacity: 0,
                ease: "power1.inOut",
            }, {
                delay:.16,
                duration: .96,
                stagger: {
                    each: .16,
                    from: "end"
                },
                opacity: 1,
            })

            // Background
            gsap.fromTo(".about-page-offset",{ 
                backgroundPositionY: 64,
                ease: "power1.in",
            }, {
                duration: 1.28,
                backgroundPositionY: 0,
            })
        },
        fadeOut(newRoute: RouteLocationNormalized) {
            
            // Background
            gsap.to(".about-page-offset",{ 
                backgroundPositionY: 64,
                ease: "power1.in",
                duration: 1.28,
            })

            gsap.to(".about-page h1", {
                text: "_",
                opacity: 0,
                ease: "none",
                duration: .64,
            })


            // Sections
            gsap.to(".about-page-offset > *",{
                duration: .96,
                stagger: {
                    each: 0.16,
                    from: "end"
                },
                opacity: 0,
                x: 56,
            })

            // Main
            gsap.to(".about-page-offset",{
                duration: 1.28,
                opacity: 0,
                ease: "power4.out",
            })


            const that = this
            gsap.to("body", {
                duration: 1,
                onComplete() {
                    that.fadedOut = true
                    that.$router.replace(newRoute.fullPath)
                }
            })
        },
    }
})

</script>


<style lang="scss">
@import "@/assets/scss/variables.scss";

.about-page {
    width: calc(100% + 32px);
    overflow-y: auto;
    height: calc(100% - 24px);
    padding-right: 32px;
    position: relative;

    &.__isTop {
        .top-shadow {
            opacity:0;
        } 
    }
    &.__isBottom {
        .bottom-shadow {
            opacity:0;
        } 
    }

    p {
        padding: 0;
        margin: 0 0 0 0;
        font-size: 16px;
        + p {
            margin-top: 24px;
        }
    }
    #section1,
    #section2,
    #section3,
    #section4 {
        a {
            color: #091B3D;
            text-decoration: underline;
            transition: ease .5 all;
            &:hover,
            &:focus {
                text-decoration: none;
                opacity: .5;
            }
        }
    }

    h1 {
        font-family: $accentFont;
        font-size: 32px;
        margin: 0;
        width: 100%;
        display: inline-block;
        line-height: 0.7;
        
        @media all and (min-width: 512px) {
            line-height: 1;
            font-size: 40px;
        }
        @media all and (min-width: 720px) {
            font-size: 48px;
        }
    }

    @media all and (min-width: 800px) {
        width: 100%;
        padding-right: 64px;
        max-width: calc(100% - 16px);
        
        p {
            font-size: 18px;
        }
    }
}

.about-page-offset {
    background-image:none;
    background-repeat: repeat-y;
    background-size: 36px;
    padding-left: 24px;
    padding-right: 24px;
    margin-top: 24px;
    padding-bottom: 40px;
    
    @media all and (min-width: 800px) {
        padding-left: 58px;
        background-image:url("/images/vertical-line.svg");
    }
}

.__isPortrait {
    .about-page { 
        h1 {
            margin-top: 34px;
            text-align: center;
            > span {
                display: none;
            }
        }
    }
}

.__isLandscape {
    .about-page {
        height: 100%;
        h1 {
            margin-top: 0;
            margin-left: 0;
        }
    }

    .about-page-offset {
        margin-top: 32px;
        padding-right: 8px;
        padding-bottom: 64px;
    }
}


#section5 {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 64px;
    .simple-analytics-badge {
        height: 32px;
        mix-blend-mode: darken;
        filter: grayscale(100%);
        opacity: .2;
        transition: .4s ease all;
        
        &:hover {
            opacity: 1;
            filter: grayscale(0%);
            height: 64px;
        }
    }
}

.about-content {
    margin-top: 56px;
    margin-bottom: 64px;
    margin-left: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
    .aztech-grid-cell {
        width: 100%;
        display: none;
        &:first-child {
            display: flex;

        }
        img {
            width: 100%;
        }
    }

    @media all and (min-width: 640px) {
        .aztech-grid-cell {
            width: calc(50% - 16px);
            &:nth-child(3){
                display: flex;
            }
        }
    }

    @media all and (min-width: 716px) {
        .aztech-grid-cell {
            width: 100%;
            &:nth-child(3){
                display: none;
            }
        }
    }

    @media all and (min-width: 888px) {
        .aztech-grid-cell {
            width: calc(50% - 16px);
            &:nth-child(3){
                display: flex;
            }
        }
    }

    @media all and (min-width: 1120px) {
        .aztech-grid-cell {
            width: calc(33% - 16px);
            display: flex;
        }
    }

}


</style>