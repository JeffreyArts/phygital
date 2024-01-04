<template>
    <div class="view-3d">
        <h1>View not found</h1>
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import App from "@/stores/app"
import _ from "lodash"

export default defineComponent ({ 
    name: "view3D",
    components: {},
    props: [],
    setup() {
        const app = App()

        return { app}
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
        //
    },
    methods: {
        
    }
})

</script>


<style lang="scss">
@import "@/assets/scss/variables.scss";



</style>