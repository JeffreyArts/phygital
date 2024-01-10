<template>
    <div>
        <aside class="dashboard-sidebar">
            <!-- <section @click="select('cube-faces')">
                <main-cube-faces/>
            </section> -->
            <section id="s-seed">
                <section-seed/>
            </section>
            <section id="s-surfaces">
                <section-surfaces :activeView="activeView"/>
            </section>
            <section id="s-dimensions">
                <section-meta-dimensions />
            </section>
            <section id="s-cube3d" @click="select('cube-3d')" @mousedown="setSelection" @mousemove="cancelSelection">
                <!-- <section-cube3d name="sidebar" />
                <svg :class="activeView === 'cube-3d' ? '__isHidden' : ''" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 37 64" xml:space="preserve">
                    <path d="M30.9,11v18.8h-1.7V4.4h-6.1v25.4h-1.7V0h-6.1v29.8h-1.7V3.3H7.7v35.9H6.1V19.9H0v25.7C0,55.7,8.3,64,18.5,64 C28.7,64,37,55.7,37,45.5V11H30.9z M13.2,41.4H17v-3.9h3.9v3.9h3.9v3.9h-3.9v3.9H17v-3.9h-3.9V41.4z M19,58.4 c-6.4,0-11.7-4.8-12.4-11h3.9c0.7,4.1,4.2,7.2,8.5,7.2c4.3,0,7.8-3.1,8.5-7.2h3.9C30.7,53.6,25.4,58.4,19,58.4z"/>
                </svg> -->

            </section>
            <section id="s-download">
                <section-download/>
            </section>
            <section id="s-links">
                <!-- <section-links/> -->
            </section>
            <section id="s-view-edit" v-if="activeView === 'cube-faces'">
                <section-view-edit-button />
            </section>
            <section id="s-surface-dimensions" v-if="activeView === 'cube-faces'">
                <!-- <sectionSurfaceDimensions /> -->
            </section>
        </aside>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import _ from "lodash"
import App from "@/stores/app"
import sectionSeed from "@/components/sections/cube-seed.vue"
import sectionMetaDimensions from "@/components/sections/meta-dimensions.vue"
import sectionDownload from "@/components/sections/download-model.vue"
import sectionSurfaces from "@/components/sections/surfaces-grid.vue"
import sectionViewEditButton from "@/components/sections/view-edit-button.vue"

export default defineComponent({
    name: "dashboard-sidebar",
    components: {
        sectionDownload,
        sectionMetaDimensions,
        sectionSeed,
        sectionSurfaces,
        sectionViewEditButton,
    },
    setup() {
        const app = App()

        return { app }
    },
    data: () => {
        return {
            
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
        
    }
})
</script>

<style lang="scss">
@import "./../assets/scss/variables.scss";
.dashboard-sidebar-container[data-grid="3x8"] {
    overflow: visible;
    
    .dashboard-sidebar {
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-columns: 1fr 1fr 1fr;
    }
}
.dashboard-sidebar-container[data-grid="8x2"] {
    .dashboard-sidebar {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
    }
}


#s-seed {
    background-color: rgba(255,255,0,.32);
}
#s-surfaces {
    background-color: rgba(255,0,255,.32);
}
#s-dimensions {
    background-color: rgba(0,255,255,.32);
}
#s-cube3d {
    background-color: rgba(0,255,0,.32);
}
#s-download{
    background-color: rgba(0,0, 255,.32);
}
#s-links {
    background-color: rgba(255,0,0,.32);
}
.dashboard-sidebar {
    display: grid;
    

    // &.__2Columns {
    //     grid-template-columns: 1fr 1fr;
    //     gap: 8px;
    // }
}
// .dashboard-sidebar[data-grid="3x6"] {
//     #s-seed {
//         grid-column: 2;
//         grid-row: 1/2;
//     }
//     #s-surfaces {
//         grid-column: 2;
//         grid-row: 2/4;
//     }
//     #s-dimensions {
//         grid-column: 2;
//         grid-row: 4/5;
//     }
    
//     #s-cube3d {
//         grid-column: 2;
//         grid-row: 5/7;
//     }
    
//     #s-download {
//         grid-column: 2;
//         grid-row: 5/6;
//         display: none;
//     }
//     #s-view-edit {
//         grid-column: 1;
//         grid-row:6/7;
//     }
// }
.dashboard-sidebar-container[data-grid="3x8"] {

    #s-surfaces {
        grid-column: 2/4;
        grid-row: 2/4;
    }
    #s-dimensions {
        grid-column: 2/4;
        grid-row: 4/5;
    }
    
    #s-cube3d {
        grid-column: 2/4;
        grid-row: 5/7;
    }

    #s-seed {
        grid-column: 2/4;
        grid-row: 1/2;
    }
    
    #s-download {
        grid-column: 2/4;
        grid-row: 7/8;
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
}

.dashboard-sidebar-container[data-grid="8x2"] {
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


// .dashboard-sidebar[data-grid="6x6"] {
//     #s-seed {
//         grid-column: 3/7;
//         grid-row: 2/4;
//     }
//     #s-surfaces {
//         grid-column: 3/7;
//         grid-row: 3/5;
//     }
    
//     #s-cube3d {
//         grid-column: 1/3;
//         grid-row: 3/4;
//     }
    
//     #s-dimensions {
//         display: none;
//     }
    
//     #s-download {
//         grid-column: 1/3;
//         grid-row: 4/5;
//     }
    
//     #s-view-edit {
//         grid-column: 5/7;
//         grid-row:1/2;
//     }
//     #s-surface-dimensions {
//         grid-column: 3/5;
//         grid-row: 1/2;
//     }
// }
</style>
