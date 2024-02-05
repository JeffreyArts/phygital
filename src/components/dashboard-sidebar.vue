<template>
    <div ref="container">
        <aside class="dashboard-sidebar">
            <section id="s-seed">
                <section-seed/>
            </section>
            <section id="s-surfaces">
                <section-surfaces :activeView="app.activeView"/>
            </section>
            <section id="s-dimensions">
                <section-meta-dimensions />

                <aztech-tut-message class="meta-dimensions-section-tut" :visible="app.tutMessages.metaDimensionsSection">
                    A handy calculator for calculating the final dimensions of the phygitalized model
                </aztech-tut-message>
            </section>
            <section id="s-cube3d" @click="select3dView" @mousedown="setSelection" @mousemove="cancelSelection">
                <section-vpg-3d name="sidebar" />
                <svg :class="[
                    app.activeView === 'view-3d' ? '__isHidden' : '',
                    selected3DView ? '__isHidden' : '',
                    ]" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 37 64" xml:space="preserve">
                    <path d="M30.9,11v18.8h-1.7V4.4h-6.1v25.4h-1.7V0h-6.1v29.8h-1.7V3.3H7.7v35.9H6.1V19.9H0v25.7C0,55.7,8.3,64,18.5,64 C28.7,64,37,55.7,37,45.5V11H30.9z M13.2,41.4H17v-3.9h3.9v3.9h3.9v3.9h-3.9v3.9H17v-3.9h-3.9V41.4z M19,58.4 c-6.4,0-11.7-4.8-12.4-11h3.9c0.7,4.1,4.2,7.2,8.5,7.2c4.3,0,7.8-3.1,8.5-7.2h3.9C30.7,53.6,25.4,58.4,19,58.4z"/>
                </svg>
            </section>
            <section id="s-download">
                <section-download/>
            </section>
            <section id="s-links">
                <section-links/>
            </section>
            <section id="s-app-options">
                <section-app-options />
            </section>
            <section id="s-edit-options" v-if="app.activeView === 'view-surfaces'">
                <section-edit-options />
            </section>
            <section id="s-view-edit" v-if="app.activeView === 'view-surfaces'">
                <section-view-edit-button />
                <aztech-tut-message class="view-edit-section-tut" :visible="app.tutMessages.viewEditSection">
                    Click on the hand to toggle the edit mode on or off
                </aztech-tut-message>
            </section>
            
            <section id="s-surface-dimensions" v-if="app.activeView === 'view-surfaces'">
                <sectionSurfaceDimensions />
            </section>
        </aside>
        <div class="left-shadow"></div>    
        <div class="right-shadow"></div>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import App from "@/stores/app"
import AztechTutMessage from "@/components/aztech/tutorial-message.vue"
import sectionSeed from "@/components/sections/cube-seed.vue"
import sectionMetaDimensions from "@/components/sections/meta-dimensions.vue"
import sectionDownload from "@/components/sections/download-model.vue"
import sectionSurfaces from "@/components/sections/surfaces-grid.vue"
import sectionAppOptions from "@/components/sections/app-options.vue"
import sectionEditOptions from "@/components/sections/edit-options.vue"
import sectionViewEditButton from "@/components/sections/view-edit-button.vue"
import sectionSurfaceDimensions from "@/components/sections/surface-dimensions.vue"
import sectionLinks from "@/components/sections/links.vue"
import sectionVpg3d from "@/components/sections/vpg-3d.vue"

export default defineComponent({
    name: "dashboard-sidebar",
    components: {
        sectionDownload,
        sectionMetaDimensions,
        sectionSeed,
        sectionSurfaces,
        sectionViewEditButton,
        sectionSurfaceDimensions,
        sectionLinks,
        sectionVpg3d,
        sectionEditOptions,
        sectionAppOptions,
        AztechTutMessage
    },
    setup() {
        const app = App()

        return { app }
    },
    data: () => {
        return {
            selection: {x: 0, y:0},
            selected3DView: false,
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
    watch: {
    
    },
    mounted() {
        
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
            // Set left
            if (target.scrollLeft < 1) {
                target.classList.add("__isLeft")
            } else {
                target.classList.remove("__isLeft")
            }
            // Set right
            if (target.scrollLeft+ target.offsetWidth + 5 > target.scrollWidth) {
                target.classList.add("__isRight")
            } else {
                target.classList.remove("__isRight")
            }
        },
        setSelection(event:MouseEvent) {
            this.selection.x = event.clientX
            this.selection.y = event.clientY
        },
        select3dView() {
            if (this.selection.x !== 0 && this.selection.y !== 0) {
                this.selected3DView = true
                setTimeout(() => {
                    this.selected3DView = false
                }, 1000)
                this.$router.replace("/3D-view")
            }
        },
        cancelSelection(event:MouseEvent) {
            if (Math.abs(this.selection.x - event.clientX) > 4 || Math.abs(this.selection.y - event.clientY) > 4) {
                this.selection.x = 0
                this.selection.y = 0
            }
        }
        
    }
})
</script>

<style lang="scss">
@import "./../assets/scss/variables.scss";
.dashboard-sidebar-container {
    position: relative;
}
.dashboard-sidebar {
    display: grid;
    section {
        position: relative;
    }
}

.__isLandscape {
    .dashboard-sidebar-container {
        overflow: visible;
        height: 100%;
        aspect-ratio: 3/8;
        .left-shadow,
        .right-shadow {
            opacity: 0;
        }
    
        .dashboard-sidebar {
            grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
            grid-template-columns: 1fr 1fr 1fr;
            height: 100%;
            gap: 0 8px;
        }
    
        //
        // Sections
        //
    
        #s-surfaces {
            grid-column: 2/4;
            grid-row: 2/4;
        }
        #s-dimensions {
            grid-column: 2/4;
            grid-row: 7/8;
        }
        
        #s-cube3d {
            grid-column: 2/4;
            grid-row: 4/6;
            position: relative;
        }
    
        #s-seed {
            grid-column: 2/4;
            grid-row: 1/2;
            z-index: 10;
        }
        
        #s-download {
            grid-column: 2/4;
            grid-row: 6/7;
        }
    
        #s-links {
            grid-column: 2/4;
            grid-row: 8/9;
        }
    
        #s-view-edit {
            grid-column: 1/2;
            grid-row:8/9;
        }
        #s-surface-dimensions {
            grid-column: 1/2;
            grid-row: 2/4;
        }
        #s-edit-options {
            grid-column: 1/2;
            grid-row: 7/8;
            padding-bottom: 10px;
        }
    
        .view-edit-container {
            @media screen and (min-height: 760px) {
                width: calc(100% - 16px);
            }
        }
    }
    
    .view-edit-section-tut {
        position: absolute;
        right: 6px;
        top: -12px;
    }

    .meta-dimensions-section-tut {
        position: absolute;
        left: 96px;
        bottom: 0px;
        .aztech-tut-message-text {
            width: 220px;
        }
    }
}

.__isPortrait {
    .dashboard-sidebar-container {

        &.__isLeft {
            .left-shadow {
                opacity: 0;
            }
        }
        &.__isRight {
            .right-shadow {
                opacity: 0;
            }
        }
        
        .dashboard-sidebar {
            height: calc(3 * 64px + 32px);
            min-width: calc(13 * 64px + 16px); // Additional 16px is for padding right
            width: 100%;
            padding-top: 16px;
            grid-template-columns: 64px 64px 64px 64px 64px 64px 64px 64px 64px 64px 64px 64px 64px;
            grid-template-rows: 64px 64px 64px;   

        }

        //
        // Sections
        //
        #s-cube3d {
            grid-column: 1/4;
            grid-row: 1/4;
        }

        #s-surfaces {
            grid-column: 4/7;
            grid-row: 1/4;
        }
        #s-dimensions {
            grid-column: 10/13;
            grid-row:1/3;
        }
        #s-app-options {
            grid-column: 7/10;
            grid-row:1/2;
            padding-top: 30px;
            padding-left: 16px;
            .app-options-section {
                justify-content: flex-start;
            }
        }

        #s-links {
            grid-column: 7/11;
            grid-row: 2/4;
            padding-bottom: 30px;
            padding-left: 16px;
            pointer-events: none; // Cause it is overlapping #s-dimensions
        }

        // Repositioned items
        #s-surface-dimensions {
            position: fixed;
            bottom: calc(3 * 64px + 32px);
            height: 64px;
            width: 64px;
            left: 16px;
        }

        #s-seed {
            z-index: 10;
            position: fixed;
            top: 6px;
            right: 20px;
            height: 76px;
            width: 158px;
        }
        #s-download {
            position: fixed;
            bottom: calc(3 * 64px + 32px);
            right: 0;
            height: 64px;
            width: 96px;
        }

        #s-view-edit {
            position: fixed;
            bottom: calc(3 * 64px + 32px);
            right: 16px;
            height: 64px;
            width: 96px;
            z-index: 1; // Force it to overlay download button
        }

        #s-edit-options {
            position: fixed;
            bottom: calc(3 * 64px + 32px);
            left: 50%;
            height: 64px;
            translate: -50% 6px;
            padding-bottom: 0;
        }
    }

    .view-edit-section-tut {
        position: absolute;
        right: -4px;
        top: -16px;
    }

    .meta-dimensions-section-tut {
        position: absolute;
        bottom: 0px;
        left: 96px;
        top: 72px;
        .aztech-tut-message-text {
            width: 220px;
        }
    }
}


#s-cube3d {
    svg {
        opacity: 0;
        transition: .24s all ease;
        position: absolute;
        right: 16px;
        bottom: 16px;
        width: 24px;
        transform: translateY(180deg);
        &.__isHidden {
            opacity: 0 !important;
        }
    }
    &:hover {
        svg {
            opacity: 1;
        }
    }
}


.left-shadow {
    background-color: #1c1c1e;
    border-radius: 100%;
    bottom: 0;
    filter: blur(16px);
    height: 220px;
    left: -4px;
    opacity: .8;
    pointer-events: none;
    position: fixed;
    transition: opacity .4s ease-out;
    width: 8px;
    z-index: 1990;
}

.right-shadow {
    background-color: #1c1c1e;
    border-radius: 100%;
    bottom: 0;
    filter: blur(16px);
    height: 220px;
    opacity: .8;
    pointer-events: none;
    position: fixed;
    right: -4px;
    transition: opacity .4s ease-out;
    width: 8px;
    z-index: 1990;
}

</style>
