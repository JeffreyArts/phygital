<template>
    <div class="view-3d">
        <vpg-3d />
        <!-- v-bind:datamodel="pattern3D" :model-changed="updatePattern" @active:camera="cameraUpdate" @mousedown="mouseDown = true" @mouseup="mouseDown = false" /> -->
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import App from "@/stores/app"
import PhygitalStore from "@/stores/phygital"
import vpg3d from "@/components/vpg-3d.vue"
import _ from "lodash"

export default defineComponent ({ 
    name: "view3D",
    components: {
        vpg3d
    },
    props: [],
    setup() {
        const app = App()
        const phygital = PhygitalStore()

        return { app, phygital}
    },
    data() {
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
    mounted() {
        document.title = "Phygital - 3D View" 
        this.app.activeView = "view-3d"
    },
    methods: {
        
    }
})

</script>


<style lang="scss">
@import "@/assets/scss/variables.scss";

.view-3d {
    width: 100%;
    height: 100%;
}


</style>