<template>
    <div class="sculptures">
        <h1>_ sculptures</h1>

        <p>| Collection of materialized objects</p>

        <div class="sculptures-container">
            <sculpture-thumbnail :src="sculpture.images[0]" :title="sculpture.name" v-for="(sculpture, i) in sculptures" :key="i" @click="selectSculpture(sculpture)"/>
        </div>

        <div class="sculpture-modal" ref="modal" :class="selectedSculpture ? '__isSelected' : ''" @click="closeModel">
            <section class="sculpture-details-container" v-if="selectedSculpture">
                <figure class="sculpture-details-main-image">
                    <AztechGridCell>
                        <img :src="selectedSculpture.images[selectedThumbnail]" />
                    </AztechGridCell>
                </figure>
                <figure class="sculpture-details-list-images">
                    <AztechGridCell 
                        class="sculpture-details-list-image"
                        @mouseenter="selectSculpture(selectedSculpture, i)"
                        @click="selectSculpture(selectedSculpture, i)"
                        v-for="(img,i) in selectedSculpture.images" :key="i">
                        <div class="sculpture-details-list-image-container" :class="selectedThumbnail == i ? '__isSelected' : ''">
                            <img :src="img" />
                        </div>
                    </AztechGridCell>
                </figure>
            </section>
            <icon class="sculpture-modal-close" type="cross" @click="closeModel($event, true)" />
        </div>
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import { RouteLocationNormalized } from "vue-router"
import App from "@/stores/app"
import sculptureThumbnail from "@/components/sculpture-thumbnail.vue"
import AztechGridCell from "@/components/aztech/grid-cell.vue"
import { TextPlugin } from "gsap/TextPlugin"
import gsap from "gsap"
import Icon from "@/components/icon.vue"

interface Sculpture {
    name:  string,
    images: Array<string>
}

export default defineComponent ({ 
    name: "sculptures-overview",
    components: {
        sculptureThumbnail,
        AztechGridCell,
        Icon
    },
    props: [],
    setup() {
        const app = App()

        return { app}
    },
    data() {
        return {
            fadedOut: false,
            selectedSculpture: null as null | Sculpture,
            selectedThumbnail: 0,
            sculptures: [
                {
                    name: "PT-1128",
                    images: [
                        "/images/sculptures/PT-1128-squared-01.jpg",
                        "/images/sculptures/PT-1128-squared-02.jpg",
                        "/images/sculptures/PT-1128-squared-03.jpg",
                        "/images/sculptures/PT-1128-squared-04.jpg",
                        "/images/sculptures/PT-1128-squared-05.jpg",
                        "/images/sculptures/PT-1128-squared-06.jpg",
                        "/images/sculptures/PT-1128-squared-07.jpg",
                        "/images/sculptures/PT-1128-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-1876",
                    images: [
                        "/images/sculptures/PT-1876-squared-01.jpg",
                        "/images/sculptures/PT-1876-squared-02.jpg",
                        "/images/sculptures/PT-1876-squared-03.jpg",
                        "/images/sculptures/PT-1876-squared-04.jpg",
                        "/images/sculptures/PT-1876-squared-05.jpg",
                        "/images/sculptures/PT-1876-squared-06.jpg",
                        "/images/sculptures/PT-1876-squared-07.jpg",
                        "/images/sculptures/PT-1876-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-2211",
                    images: [
                        "/images/sculptures/PT-2211-squared-01.jpg",
                        "/images/sculptures/PT-2211-squared-02.jpg",
                        "/images/sculptures/PT-2211-squared-03.jpg",
                        "/images/sculptures/PT-2211-squared-04.jpg",
                        "/images/sculptures/PT-2211-squared-05.jpg",
                        "/images/sculptures/PT-2211-squared-06.jpg",
                        "/images/sculptures/PT-2211-squared-07.jpg",
                        "/images/sculptures/PT-2211-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-2227",
                    images: [
                        "/images/sculptures/PT-2227-squared-01.jpg",
                        "/images/sculptures/PT-2227-squared-02.jpg",
                        "/images/sculptures/PT-2227-squared-03.jpg",
                        "/images/sculptures/PT-2227-squared-04.jpg",
                        "/images/sculptures/PT-2227-squared-05.jpg",
                        "/images/sculptures/PT-2227-squared-06.jpg",
                        "/images/sculptures/PT-2227-squared-07.jpg",
                        "/images/sculptures/PT-2227-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-2525",
                    images: [
                        "/images/sculptures/PT-2525-squared-01.jpg",
                        "/images/sculptures/PT-2525-squared-02.jpg",
                        "/images/sculptures/PT-2525-squared-03.jpg",
                        "/images/sculptures/PT-2525-squared-04.jpg",
                        "/images/sculptures/PT-2525-squared-05.jpg",
                        "/images/sculptures/PT-2525-squared-06.jpg",
                        "/images/sculptures/PT-2525-squared-07.jpg",
                        "/images/sculptures/PT-2525-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-2849",
                    images: [
                        "/images/sculptures/PT-2849-squared-01.jpg",
                        "/images/sculptures/PT-2849-squared-02.jpg",
                        "/images/sculptures/PT-2849-squared-03.jpg",
                        "/images/sculptures/PT-2849-squared-04.jpg",
                        "/images/sculptures/PT-2849-squared-05.jpg",
                        "/images/sculptures/PT-2849-squared-06.jpg",
                        "/images/sculptures/PT-2849-squared-07.jpg",
                        "/images/sculptures/PT-2849-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-3664",
                    images: [
                        "/images/sculptures/PT-3664-squared-01.jpg",
                        "/images/sculptures/PT-3664-squared-02.jpg",
                        "/images/sculptures/PT-3664-squared-03.jpg",
                        "/images/sculptures/PT-3664-squared-04.jpg",
                        "/images/sculptures/PT-3664-squared-05.jpg",
                        "/images/sculptures/PT-3664-squared-06.jpg",
                        "/images/sculptures/PT-3664-squared-07.jpg",
                        "/images/sculptures/PT-3664-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-4381",
                    images: [
                        "/images/sculptures/PT-4381-squared-01.jpg",
                        "/images/sculptures/PT-4381-squared-02.jpg",
                        "/images/sculptures/PT-4381-squared-03.jpg",
                        "/images/sculptures/PT-4381-squared-04.jpg",
                        "/images/sculptures/PT-4381-squared-05.jpg",
                        "/images/sculptures/PT-4381-squared-06.jpg",
                        "/images/sculptures/PT-4381-squared-07.jpg",
                        "/images/sculptures/PT-4381-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-4711",
                    images: [
                        "/images/sculptures/PT-4711-squared-01.jpg",
                        "/images/sculptures/PT-4711-squared-02.jpg",
                        "/images/sculptures/PT-4711-squared-03.jpg",
                        "/images/sculptures/PT-4711-squared-04.jpg",
                        "/images/sculptures/PT-4711-squared-05.jpg",
                        "/images/sculptures/PT-4711-squared-06.jpg",
                        "/images/sculptures/PT-4711-squared-07.jpg",
                        "/images/sculptures/PT-4711-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-4836",
                    images: [
                        "/images/sculptures/PT-4836-squared-01.jpg",
                        "/images/sculptures/PT-4836-squared-02.jpg",
                        "/images/sculptures/PT-4836-squared-03.jpg",
                        "/images/sculptures/PT-4836-squared-04.jpg",
                        "/images/sculptures/PT-4836-squared-05.jpg",
                        "/images/sculptures/PT-4836-squared-06.jpg",
                        "/images/sculptures/PT-4836-squared-07.jpg",
                        "/images/sculptures/PT-4836-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-5392",
                    images: [
                        "/images/sculptures/PT-5392-squared-01.jpg",
                        "/images/sculptures/PT-5392-squared-02.jpg",
                        "/images/sculptures/PT-5392-squared-03.jpg",
                        "/images/sculptures/PT-5392-squared-04.jpg",
                        "/images/sculptures/PT-5392-squared-05.jpg",
                        "/images/sculptures/PT-5392-squared-06.jpg",
                        "/images/sculptures/PT-5392-squared-07.jpg",
                        "/images/sculptures/PT-5392-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-5679",
                    images: [
                        "/images/sculptures/PT-5679-squared-01.jpg",
                        "/images/sculptures/PT-5679-squared-02.jpg",
                        "/images/sculptures/PT-5679-squared-03.jpg",
                        "/images/sculptures/PT-5679-squared-04.jpg",
                        "/images/sculptures/PT-5679-squared-05.jpg",
                        "/images/sculptures/PT-5679-squared-06.jpg",
                        "/images/sculptures/PT-5679-squared-07.jpg",
                        "/images/sculptures/PT-5679-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-6619",
                    images: [
                        "/images/sculptures/PT-6619-squared-01.jpg",
                        "/images/sculptures/PT-6619-squared-02.jpg",
                        "/images/sculptures/PT-6619-squared-03.jpg",
                        "/images/sculptures/PT-6619-squared-04.jpg",
                        "/images/sculptures/PT-6619-squared-05.jpg",
                        "/images/sculptures/PT-6619-squared-06.jpg",
                        "/images/sculptures/PT-6619-squared-07.jpg",
                        "/images/sculptures/PT-6619-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-7554",
                    images: [
                        "/images/sculptures/PT-7554-squared-01.jpg",
                        "/images/sculptures/PT-7554-squared-02.jpg",
                        "/images/sculptures/PT-7554-squared-03.jpg",
                        "/images/sculptures/PT-7554-squared-04.jpg",
                        "/images/sculptures/PT-7554-squared-05.jpg",
                        "/images/sculptures/PT-7554-squared-06.jpg",
                        "/images/sculptures/PT-7554-squared-07.jpg",
                        "/images/sculptures/PT-7554-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-7653",
                    images: [
                        "/images/sculptures/PT-7653-squared-01.jpg",
                        "/images/sculptures/PT-7653-squared-02.jpg",
                        "/images/sculptures/PT-7653-squared-03.jpg",
                        "/images/sculptures/PT-7653-squared-04.jpg",
                        "/images/sculptures/PT-7653-squared-05.jpg",
                        "/images/sculptures/PT-7653-squared-06.jpg",
                        "/images/sculptures/PT-7653-squared-07.jpg",
                        "/images/sculptures/PT-7653-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-8251",
                    images: [
                        "/images/sculptures/PT-8251-squared-01.jpg",
                        "/images/sculptures/PT-8251-squared-02.jpg",
                        "/images/sculptures/PT-8251-squared-03.jpg",
                        "/images/sculptures/PT-8251-squared-04.jpg",
                        "/images/sculptures/PT-8251-squared-05.jpg",
                        "/images/sculptures/PT-8251-squared-06.jpg",
                        "/images/sculptures/PT-8251-squared-07.jpg",
                        "/images/sculptures/PT-8251-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-9124",
                    images: [
                        "/images/sculptures/PT-9124-squared-01.jpg",
                        "/images/sculptures/PT-9124-squared-02.jpg",
                        "/images/sculptures/PT-9124-squared-03.jpg",
                        "/images/sculptures/PT-9124-squared-04.jpg",
                        "/images/sculptures/PT-9124-squared-05.jpg",
                        "/images/sculptures/PT-9124-squared-06.jpg",
                        "/images/sculptures/PT-9124-squared-07.jpg",
                        "/images/sculptures/PT-9124-squared-08.jpg",
                    ]
                },
            ] as Array<Sculpture>
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
        document.title = "Phygital - Sculptures" 
        this.app.activeView = ""
        gsap.registerPlugin(TextPlugin)
        
        this.$nextTick(()=> {
            this.fadeIn()
        })

        
        gsap.set
        
        this.$router.beforeResolve(guard => {
            if (this.$router.currentRoute.value.name != "Sculptures" || this.fadedOut) {
                return
            }
            this.fadeOut(guard)
            return false
        })

        window.addEventListener("keydown", this.keydownEventListener)
    },
    unmounted() {
        window.removeEventListener("keydown", this.keydownEventListener)
    },
    methods: {
        keydownEventListener(e: KeyboardEvent) {
            if (e.key.toLowerCase() == "escape") {
                this.closeModel(null, true)
            }
        },
        selectSculpture(sculpture: Sculpture, index = 0) {
            const modalElement = this.$refs.modal as HTMLElement
            if (!modalElement) {
                console.warn("Can't find sculpture modal: missing ref.modal")
                return
            }
            this.selectedSculpture = sculpture
            this.selectedThumbnail = index
            
            if (window.innerHeight >= window.innerWidth) {
                // portrait
            } else {
                // landscape
            }

            gsap.to(modalElement, {
                opacity: 1,
                duration: .64,
                ease: "power3.out"
            })
        },
        fadeIn(){
            gsap.set(".sculpture-modal", {
                opacity: 0
            })

            // Title
            const title = this.$el.querySelector("h1").innerText
            if (title) {
                gsap.set(".sculptures h1", {
                    text: "",
                    opacity: .2,
                })
                gsap.to(".sculptures h1", {
                    text: title,
                    opacity: 1,
                    ease: "none",
                    duration: .64,
                })
            }

            
            // Main
            gsap.set(".sculptures-container",{
                opacity: 0,
                y: 48,
            })

            gsap.to(".sculptures-container",{
                duration: .8,
                opacity: 1,
                y: 0,
                ease: "power4.out",
            })
        },
        fadeOut(newRoute: RouteLocationNormalized) {
            
            gsap.to(".sculptures h1", {
                text: "_",
                opacity: 0,
                ease: "none",
                duration: .64,
            })


            // Main
            gsap.to(".sculptures-container",{
                duration: 1.28,
                opacity: 0,
                y: 64,
                ease: "power4.out",
            })

            setTimeout(() => {
                this.fadedOut = true
                this.$router.replace(newRoute.fullPath)
            }, 1040)
        },
        closeModel(e:MouseEvent | null, force=false) {
            const modalElement = this.$refs.modal as HTMLElement
            let target = null as null | HTMLElement
            if (e) {
                target = e.target as HTMLElement
            }
            if (!modalElement && !force) {
                console.warn("Can't find sculpture modal: missing ref.modal")
                return
            }

            // Check if clicked on background
            if (!e || e.currentTarget == e.target || target?.classList.contains("sculpture-details-container") || force) {
                this.selectedSculpture = null
                this.selectedThumbnail = 0
                
                gsap.to(".sculpture-details-main-image", {
                    opacity: 0,
                    duration: .4,
                    ease: "power3.out"
                })
                gsap.to(modalElement, {
                    opacity: 0,
                    duration: .8,
                    delay:.16,
                    ease: "power3.out"
                })
            }
        }
    }
})

</script>


<style lang="scss">
@import "@/assets/scss/variables.scss";

.sculptures {
    width: 100%;
    height: 100%;

    h1 {
        font-family: $accentFont;
        margin: 0;
        font-size: 32px;
        @media all and (min-width: 512px) {
            font-size: 40px;
        }
        @media all and (min-width: 720px) {
            font-size: 48px;
        }
    }
    
}

.sculptures-container {
    margin-top: 40px;
    height:calc(100% - 80px - 48px);
    width: calc(100% - 24px);
    display: grid;
    padding-right: 40px;
    grid-template-columns: 1fr;
    gap: 32px;
    overflow: auto;
    
    @media all and (min-width: 512px) {
        gap: 64px 32px;
        grid-template-columns: 1fr 1fr;
    }
    
    @media all and (min-width: 1040px) {
        gap: 96px 64px;
        // padding-top: 64px;
        // grid-template-columns: 1fr 1fr 1fr;
    }
    
    @media all and (min-width: 1440px) {
        gap: 128px 64px;
        // padding-top: 64px;
        grid-template-columns: 1fr 1fr 1fr;
    }
}



.sculpture-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    z-index: 1990;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    background-color: rgba(255,255,255,.96);
    
    &.__isSelected {
        pointer-events: all;
    }
}

.sculpture-details-container {
    display: flex;
    aspect-ratio: 16/9;
    flex-flow: row;
    justify-content: center;
    max-height: calc(100vh - 180px);

    .aztech-grid-cell {
        display: block;
    }
}

.sculpture-details-main-image {
    // max-height: 720px;
    aspect-ratio: 1/1;
    margin: 0;
    padding: 0;
    img {
        max-width: 100%;
        float: left;
    }
}

.sculpture-details-list-images {
    margin: 0;
    padding: 0;
    // max-height: 720px;
    // max-height: calc(720px - 8.5px);
    // max-height: calc(720px - 8px);
    // max-height: calc(100vw - 256px);
    // width: 128px;
    aspect-ratio: 2/4;
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.sculpture-details-list-image {
    height: 100%;
}
.sculpture-details-list-image-container {
    display: block;
    float: left;
    height: 100%;
    &.__isSelected {
        img {
            opacity: 1;
            filter: grayscale(0%);
        }
    }
    img {
        filter: grayscale(100%);
        float: left;
        display: block;
        height: 100%;
        width: 100%;
        opacity: .32;
        transition: opacity .32s ease, filter .8s ease;
    }
}

.sculpture-modal-close {
    position: fixed;
    right: 32px;
    top: 32px;
    height: 32px;
    transition: all ease .32s;
    cursor: pointer;

    &:hover {
        scale: .8;
    }
}
</style>