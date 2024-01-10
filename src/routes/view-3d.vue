<template>
    <div class="view-3d">
        <h1>View 3D</h1>
        <h2>{{ phygital.seed }}</h2>
        <h2>{{ app }}</h2>
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import App from "@/stores/app"
import PhygitalStore from "@/stores/phygital"
import _ from "lodash"

export default defineComponent ({ 
    name: "view3D",
    components: {},
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



</style>