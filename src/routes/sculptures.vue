<template>
    <div class="sculptures">
        <header class="sculptures-header">
            <h1><span>_ </span> sculptures</h1>
            
            <p>| Collection of physicalized objects</p>
        </header>

        <div class="sculptures-container" ref="container">
            <div class="sculptures-container-wrapper">
                <sculpture-thumbnail :src="sculpture.images[0]" :title="sculpture.name" v-for="(sculpture, i) in sculptures" :key="i" @click="selectSculpture(sculpture)" @mouseenter="mouseEnterEvent" @mouseleave="mouseLeaveEvent"/>
            </div>
            
            <div class="top-shadow"></div>
            <div class="bottom-shadow"></div>
        </div>

        <div class="sculpture-modal" ref="modal" :class="selectedSculpture ? '__isSelected' : ''" @click="closeModel" @mouseleave="arrowMouseLeave">
            <section class="sculpture-details-container" v-if="selectedSculpture">
                <figure class="sculpture-details-main-image">
                    <AztechGridCell>
                        <img :src="selectedSculpture.images[selectedThumbnail]" />
                    </AztechGridCell>
                    <svg class="sculpture-modal-previous" @click="previousSculpture()" @mouseenter="arrowMouseEnter" @mouseleave="arrowMouseLeave" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve">
                        <g>
                            <polygon points="20,0 22.5,0 22.5,5 21.2,5 16.7,17.5 15,18.7 15,21.2 16.7,22.5 21.3,35 22.5,35 22.5,40 20,40 17.5,37.5 17.5,35 5,22.5 5,17.5 17.5,5 17.5,2.5 20,0 	"/> 
                            <polygon points="37.5,0 40,0 40,5 38.7,5 34.2,17.5 32.5,18.7 32.5,21.2 34.2,22.5 38.8,35 40,35 40,40 37.5,40 35,37.5 35,35 22.5,22.5 22.5,17.5 35,5 35,2.5 37.5,0 	"/>
                        </g>
                    </svg>

                    <svg class="sculpture-modal-next" @click="nextSculpture()" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve">
                        <g>
                            <polygon points="20,40 17.5,40 17.5,35 18.8,35 23.3,22.5 25,21.3 25,18.8 23.3,17.5 18.7,5 17.5,5 17.5,0 20,0 22.5,2.5 22.5,5 35,17.5 35,22.5 22.5,35 22.5,37.5 20,40 	"/>
                            <polygon points="2.5,40 0,40 0,35 1.3,35 5.8,22.5 7.5,21.3 7.5,18.8 5.8,17.5 1.2,5 0,5 0,0 2.5,0 5,2.5 5,5 17.5,17.5 17.5,22.5 5,35 5,37.5 2.5,40 	"/>
                        </g>
                    </svg>
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

                    <svg class="sculpture-modal-next" @click="nextSculpture()" @mouseenter="arrowMouseEnter" @mouseleave="arrowMouseLeave" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve">
                        <g>
                            <polygon points="20,40 17.5,40 17.5,35 18.8,35 23.3,22.5 25,21.3 25,18.8 23.3,17.5 18.7,5 17.5,5 17.5,0 20,0 22.5,2.5 22.5,5 35,17.5 35,22.5 22.5,35 22.5,37.5 20,40 	"/>
                            <polygon points="2.5,40 0,40 0,35 1.3,35 5.8,22.5 7.5,21.3 7.5,18.8 5.8,17.5 1.2,5 0,5 0,0 2.5,0 5,2.5 5,5 17.5,17.5 17.5,22.5 5,35 5,37.5 2.5,40 	"/>
                        </g>
                    </svg>

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
import gsap from "@/services/gsap-wrapper"
import Icon from "@/components/icon.vue"

interface Sculpture {
    name:  string,
    images: Array<string>
}

const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Phygital sculptures",
    "description": "Collection of physicalized objects",
    "image": "https://www.interphygital.nl/images/PT-1128.jpg",
    "offers": {
        "@type": "AggregateOffer",
        "highPrice": "1040",
        "lowPrice": "800",
        "priceCurrency": "EUR"
    }
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
    head: { 
        title: "Interphygital - Sculptures",
        meta: [
            {
                name: "Sculptures overview",
                content: "An overview of concrete poured sculptures made via the Interphygital process",
            },
        ],
        script: [
            {
                hid: "breadcrumbs-json-ld",
                type: "application/ld+json",
                textContent: JSON.stringify(schema)
            },
        ]
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
        this.app.activeView = ""
        
        this.$nextTick(()=> {
            this.fadeIn()
            gsap.to(".top-shadow, .bottom-shadow", {
                opacity: .8,
                duration: .4,
                ease: "power3.in"
            })
        })
        
        this.$router.beforeResolve(guard => {
            if (this.$router.currentRoute.value.name != "Sculptures" || this.fadedOut) {
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
        onScrollEvent(e:Event) {
            const target = e.target as HTMLElement
            
            if (!target) {
                return
            }

            this.updateShadows(target) 
        },
        arrowMouseEnter(event: MouseEvent) {
            const currentTarget = event.currentTarget as HTMLElement
            if (!currentTarget) {
                return
            }
            let x = 4
            if (currentTarget.classList.contains("sculpture-modal-next")){
                x = -4
            }
            gsap.to(currentTarget, {
                x,
                duration: .32,
                ease: "power3.out"
            })
        },
        arrowMouseLeave(event: MouseEvent) {
            const currentTarget = event.currentTarget
            if (!currentTarget) {
                return
            }
            
            gsap.to(currentTarget, {
                x: 0,
                duration: .32,
                ease: "power3.out"
            })
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

            // Text
            const text = this.$el.querySelector("p").innerText
            if (text) {
                gsap.set(".sculptures p", {
                    text: "",
                    opacity: .2,
                })
                gsap.to(".sculptures p", {
                    text: text,
                    opacity: 1,
                    ease: "power4.inOut",
                    duration: .8,
                })
            }

            
            // Main
            gsap.set(".sculpture-thumbnail",{
                opacity: 0,
                x: 32,
            })

            gsap.to(".sculpture-thumbnail",{
                duration: 1.28,
                opacity: 1,
                stagger: .08,
                x: 0,
                ease: "power1.inOut",
            })
        },
        fadeOut(newRoute: RouteLocationNormalized) {
            
            gsap.to(".sculptures h1", {
                text: "_",
                opacity: 0,
                ease: "none",
                duration: .64,
            })

            gsap.to(".sculptures p", {
                text: "|",
                opacity: 0,
                ease: "power4.inOut",
                duration: .48,
            })

            // Main
            gsap.to(".sculpture-thumbnail",{
                duration: 0.72,
                stagger: .04,
                ease: "power2.inOut",
                opacity: 0,
                x: 40,
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
        },
        nextSculpture() {
            let nextIndex = 0
            this.sculptures.forEach((sculpture, index) => {
                if (sculpture.name == this.selectedSculpture?.name) {
                    if (index < this.sculptures.length - 1) {
                        nextIndex = index+1
                    }
                }
            })

            gsap.killTweensOf(".sculpture-modal-next polygon")
            gsap.to(".sculpture-modal-next polygon", {
                x: 5,
                duration: .32,
                ease: "power1.inOut"
            })
            
            gsap.to(".sculpture-modal-next polygon", {
                x: 0,
                delay: .32,
                duration: .56,
                ease: "power4.out"
            })
            
            this.selectSculpture(this.sculptures[nextIndex], 0)
        },
        previousSculpture() {
            let nextIndex = 0
            this.sculptures.forEach((sculpture, index) => {
                if (sculpture.name == this.selectedSculpture?.name) {
                    if (index <= 0) {
                        nextIndex = this.sculptures.length - 1
                    } else {
                        nextIndex = index-1
                    }
                }
            })

            gsap.killTweensOf(".sculpture-modal-previous polygon")
            gsap.to(".sculpture-modal-previous polygon", {
                x: -5,
                duration: .32,
                ease: "power1.inOut"
            })
            
            gsap.to(".sculpture-modal-previous polygon", {
                x: 0,
                delay: .32,
                duration: .56,
                ease: "power4.out"
            })

            this.selectSculpture(this.sculptures[nextIndex], 0)
        },
        mouseEnterEvent(event: MouseEvent){ 
            const currentTarget = event.currentTarget as HTMLElement
            if (!currentTarget) {
                return
            }

            document.querySelectorAll(".sculpture-thumbnail").forEach( (domElement, i) => {
                gsap.killTweensOf(domElement)
                if (domElement == currentTarget) {
                    setTimeout(() => {
                        gsap.to(domElement, {
                            opacity: 1,
                            blur:0,
                            filter: "grayscale(0%)",
                            duration: .4,
                            ease: "power4.out"
                        })
                    })
                    return
                }

                gsap.to(domElement, {
                    blur: 4,
                    filter: "grayscale(100%)",
                    duration: 2.4,
                    ease: "power4.out"
                })
                gsap.to(domElement, {
                    opacity: .16,
                    duration: .8,
                    ease: "power4.out"
                })
            })


            gsap.to(event.currentTarget, {
                filter: "grayscale(0%)",
                duration: .64,
                ease: "power4.out"
            })

            const dotsHeader = currentTarget.querySelectorAll(".sculpture-thumbnail-header-svg .dot")
            const dotsFooter = currentTarget.querySelectorAll(".sculpture-thumbnail-footer-svg .dot")
            gsap.killTweensOf(dotsFooter)
            gsap.killTweensOf(dotsHeader)
            if (dotsHeader) {    
                gsap.to(dotsHeader, {
                    stagger: {
                        each: .08,
                        from: "start"
                    },
                    duration: .64,
                    opacity: 1,
                    ease: "power3.out"
                })
            }

            if (dotsFooter) {    
                gsap.to(dotsFooter, {
                    stagger: {
                        each: .08,
                        from: "start"
                    },
                    duration: .64,
                    opacity: 1,
                    ease: "power3.out"
                })
            }
        },
        mouseLeaveEvent(event: MouseEvent){
            const currentTarget = event.currentTarget as HTMLElement
            if (!currentTarget) {
                return
            }
            const dotsHeader = currentTarget.querySelectorAll(".sculpture-thumbnail-header-svg .dot")
            if (dotsHeader) {    
                gsap.to(dotsHeader, {
                    stagger: {
                        each: .08,
                        from: "end"
                    },
                    duration: .64,
                    opacity: 0,
                    ease: "power3.out"
                })
            }
            
            const dotsFooter = currentTarget.querySelectorAll(".sculpture-thumbnail-footer-svg .dot")
            if (dotsFooter) {    
                gsap.to(dotsFooter, {
                    stagger: {
                        each: .08,
                        from: "end"
                    },
                    duration: .64,
                    opacity: 0,
                    ease: "power3.out"
                })
            }

            document.querySelectorAll(".sculpture-thumbnail").forEach( (domElement) => {
                gsap.killTweensOf(domElement)
                gsap.to(domElement, {
                    opacity: 1,
                    duration: .96,
                    filter: "grayscale(0%)",
                    blur: 0,
                    ease: "power4.out"
                })
            })
        }
    }
})

</script>


<style lang="scss">
@import "@/assets/scss/variables.scss";

.sculptures {
    width: 100%;
    height: calc(100% - 16px);
    display: flex;
    flex-flow: column;

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
}

.__isLandscape {
    .sculptures {
        height: 100%;
    }
    .sculptures-container {
        margin-top: 24px;
    }
}

.sculptures-container-wrapper {
    grid-template-columns: 1fr;
    gap: 32px;
    display: grid;
    padding-right: 24px;
    padding-left: 24px;

    @media all and (min-width: 512px) {
        gap: 64px 32px;
        grid-template-columns: 1fr 1fr;
        padding-right: 40px;
    }

    @media all and (min-width: 1040px) {
        gap: 96px 64px;
    }

    @media all and (min-width: 1440px) {
        gap: 128px 64px;
        grid-template-columns: 1fr 1fr 1fr;
    }
}

.sculptures-container {
    margin-top: 8px;
    width: 100%;
    height:100%;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    
    &.__isTop {
        .top-shadow {
            opacity: 0 !important;
        }
    }
    &.__isBottom {
        .bottom-shadow {
            opacity: 0 !important;
        }
    }

    @media all and (min-width: 512px) {
        margin-top: 40px;
        height:calc(100% - 80px - 48px);
        width: calc(100% - 24px);
    }
    
}



.sculpture-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    z-index: 2023;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    background-color: rgba(255,255,255,.96);
    
    user-select: none; // chrome and Opera
    -moz-user-select: none; // Firefox
    -webkit-text-select: none; // IOS Safari
    -webkit-user-select: none; // Safari
 
    &.__isSelected {
        pointer-events: all;
    }
}

.sculpture-details-container {
    display: flex;
    flex-flow: column;
    justify-content: center;
    aspect-ratio: 9/16;
    max-height: calc(100vh - 180px);
    position: relative;
    min-width: 240px;
    
    .aztech-grid-cell {
        display: block;
    }
    
    @media all and (orientation: landscape) {
        aspect-ratio: 16/9;
        flex-flow: row;
    }
}

.sculpture-details-main-image {
    // max-height: 720px;
    aspect-ratio: 1/1;
    margin: 0;
    padding: 0;
    position: relative;
    img {
        max-width: 100%;
        float: left;
    }
    
    @media all and (orientation: landscape) {
        .sculpture-modal-next {
            display: none;
        }
    }
}

.sculpture-details-list-images {
    margin: 0;
    padding: 0;
    position: relative;
    aspect-ratio: 4/2;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    .sculpture-modal-next {
        display: none;
    }
    @media all and (orientation: landscape) {
        grid-template-columns: 1fr 1fr;
        aspect-ratio: 2/4;
        .sculpture-modal-next {
            display: flex;
        }
    }
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

.sculpture-modal-next {
    position: absolute;
    right: -56px;
    top: 50%;
    height: 32px;
    margin-top: -16px;
    cursor: pointer;
}

.sculpture-modal-previous {
    position: absolute;
    left: -56px;
    top: 50%;
    height: 32px;
    margin-top: -16px;
    cursor: pointer;
}

.__isPortrait {
    .sculptures { 
        padding-top: 24px;
        
        h1 {
            margin-top: 11px;
            text-align: center;
            > span {
                display: none;
            }
        }
    }

    .sculptures-header {
        padding-left: 24px;
    }
    
    .sculpture-details-container {
        padding-right: 16px;
        padding-left: 16px;
    }
    .sculpture-modal-next {
        position: fixed;
        right: 20px;
        top: auto;
        height: 24px;
        bottom: 22px;
    }

    .sculpture-modal-previous {
        position: fixed;
        left: 20px;
        top: auto;
        height: 24px;
        bottom: 22px;
    }
    .sculpture-modal-close {
        right: 20px;
        top: 20px;
        height: 28px;
    }
}

.top-shadow {
    border-radius: 100%;
    height: 8px;
    width: calc(100% - 16px);
    left: 8px;
    bottom: calc(100% - 4px);
    top: -4px;
    background-color: #1c1c1e;
    filter: blur(16px);
    opacity: 0;
    position: sticky;
    pointer-events: none;
    z-index: 1990;
    transition: opacity .4s ease-out;
}

.bottom-shadow {
    border-radius: 100%;
    height: 8px;
    width: calc(100% - 16px);
    left: 8px;
    bottom: - 4px;
    background-color: #1c1c1e;
    filter: blur(16px);
    opacity: 0;
    position: sticky;
    pointer-events: none;
    z-index: 1990;
    transition: opacity .4s ease-out;
}
</style>