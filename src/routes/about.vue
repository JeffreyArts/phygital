<template>
    <div class="about-page">
        <h1>_ about</h1>

        <div class="about-page-offset">
            
            <p id="section1">In this time of technological advancements I see a decreasing amount of people benefiting from all of the technological innovations. With this project, I explore how I can use this same technology in my artistic proces to create beautiful physical sculptures which I make by pouring concrete. As with most of the digital technologies, this digital interface improves the pace in which I can imagine these sculptures. But more importantly, by exploring the technical limitations and possibilities of the technology, it defines my path of how I explore beauty in geometric symmetry.</p>
            
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

            <p id="section3">With Phygital — a blend of the words physical & digital — I have chosen to polish the interface of my work process and publish it into the world, allowing anyone to use it for personal purposes at no cost (this includes the source code). Because I believe that technological advancements should be accessible by everyone. If you like what I do and want to support me. You can do so by letting me know via <a href="https://www.instagram.com/jeffrey.arts/">Instagram</a>, sending me an <a href="mailto:contact@jeffreyarts.nl">e-mail</a> or by purchasing one of the <a href="https://www.artmajeur.com/jeffrey-arts">sculptures</a> that I've made.</p>
            <p id="section4">Special thanks go out to <a href="https://fontforzula.gumroad.com">fontforzula</a>, who made the visual assets that I have used to build this digital interface with.</p>
        </div>
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import { RouteLocationNormalized } from "vue-router"
import App from "@/stores/app"
import PhygitalStore from "@/stores/phygital"
import AztechGridCell from "@/components/aztech/grid-cell.vue"
import gsap from "gsap"
import { TextPlugin } from "gsap/TextPlugin"

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
            fadedOut: false
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
        gsap.registerPlugin(TextPlugin)

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

    },
    methods: {
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

            setTimeout(() => {
                this.fadedOut = true
                this.$router.replace(newRoute.fullPath)
            }, 1040)
        },
    }
})

</script>


<style lang="scss">
@import "@/assets/scss/variables.scss";

.about-page {
    width: 100%;
    overflow-y: auto;
    height: 100%;
    padding-right: 64px;
    max-width: calc(100% - 16px);

    p {
        padding: 0;
        margin: 0 0 0 0;
        font-size: 16px;
        + p {
            margin-top: 24px;
        }
    }
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
    h1 {
        font-family: $accentFont;
        margin: 0;
        font-size: 48px;
    }

    @media all and (min-width: 800px) {
        p {
           font-size: 18px;
        }
    }
}

.about-page-offset {
    padding-left: 58px;
    background-image:url("/images/vertical-line.svg");
    background-repeat: repeat-y;
    background-size: 36px;
    margin-top: 32px;
    padding-bottom: 64px;
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