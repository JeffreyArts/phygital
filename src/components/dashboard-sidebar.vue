<template>
    <div>
        <aside class="dashboard-sidebar">
            <section id="s-seed">
                <section-seed/>
            </section>
            <section id="s-surfaces">
                <section-surfaces :activeView="app.activeView"/>
            </section>
            <section id="s-dimensions">
                <section-meta-dimensions />
            </section>
            <section id="s-cube3d" @click="select3dView" @mousedown="setSelection" @mousemove="cancelSelection">
                <section-vpg-3d name="sidebar" />
                <svg :class="app.activeView === 'view-3d' ? '__isHidden' : ''" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 37 64" xml:space="preserve">
                    <path d="M30.9,11v18.8h-1.7V4.4h-6.1v25.4h-1.7V0h-6.1v29.8h-1.7V3.3H7.7v35.9H6.1V19.9H0v25.7C0,55.7,8.3,64,18.5,64 C28.7,64,37,55.7,37,45.5V11H30.9z M13.2,41.4H17v-3.9h3.9v3.9h3.9v3.9h-3.9v3.9H17v-3.9h-3.9V41.4z M19,58.4 c-6.4,0-11.7-4.8-12.4-11h3.9c0.7,4.1,4.2,7.2,8.5,7.2c4.3,0,7.8-3.1,8.5-7.2h3.9C30.7,53.6,25.4,58.4,19,58.4z"/>
                </svg>
            </section>
            <section id="s-download">
                <section-download/>
            </section>
            <section id="s-links">
                <section-links/>
            </section>
            <section id="s-view-edit" v-if="app.activeView === 'view-surfaces'">
                <section-view-edit-button />
            </section>
            <section id="s-surface-dimensions" v-if="app.activeView === 'view-surfaces'">
                <sectionSurfaceDimensions />
            </section>
        </aside>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import _ from "lodash"
import gsap from "gsap"
import App from "@/stores/app"
import sectionSeed from "@/components/sections/cube-seed.vue"
import sectionMetaDimensions from "@/components/sections/meta-dimensions.vue"
import sectionDownload from "@/components/sections/download-model.vue"
import sectionSurfaces from "@/components/sections/surfaces-grid.vue"
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
        sectionVpg3d
    },
    setup() {
        const app = App()

        return { app }
    },
    data: () => {
        return {
            selection: {x: 0, y:0},
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
        //
    },
    methods: {
        setSelection(event:MouseEvent) {
            this.selection.x = event.clientX
            this.selection.y = event.clientY
        },
        select3dView() {
            if (this.selection.x !== 0 && this.selection.y !== 0) {
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
.dashboard-sidebar {
    display: grid;
    section {
        position: relative;
    }
}

.dashboard-sidebar-container {
    position: absolute;
    overflow:auto;
}

.dashboard-sidebar-container[data-grid="3x8"] {
    overflow: visible;
    
    .dashboard-sidebar {
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-columns: 1fr 1fr 1fr;
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
    }

    #s-seed {
        grid-column: 2/4;
        grid-row: 1/2;
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

    .view-edit-container {
        @media screen and (min-height: 760px) {
            width: calc(100% - 16px);
        }
    }
}

.dashboard-sidebar-container[data-grid="8x2"] {
    .dashboard-sidebar {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
    }

    //
    // Sections
    //

    #s-surfaces {
        grid-column: 1/2;
        grid-row: 1/3;
    }
    #s-dimensions {
        grid-column: 3;
        grid-row:2;
    }
    #s-surface-dimensions {
        grid-column: 3;
        grid-row:1;
    }
    
    #s-cube3d {
        grid-column: 4/5;
        grid-row:1;
    }

    #s-seed {
        grid-column: 5/6;
        grid-row:1;
    }
    
    #s-download {
        grid-column: 6/7;
        grid-row:1;
    }

    #s-links {
        grid-column: 7/8;
        grid-row:1;
    }

    #s-view-edit {
        grid-column: 8/9;
        grid-row:1;
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
</style>
