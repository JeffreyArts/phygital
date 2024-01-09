<template>
    <div class="view-section-container" ref="container">
        <vpg-svg-editable class="svg-container" />
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import AppStore from "@/stores/app"
import vpgSvgEditable from "@/components/vpg-svg-editable.vue"

import _ from "lodash"

export default defineComponent ({ 
    name: "routeViewSection",
    components: {
        vpgSvgEditable
    },
    props: [],
    setup() {
        const app = AppStore()

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
        document.title = "Phygital - Surface editor" 
        this.app.activeView = "cube-faces"
    },
    methods: {
        
    }
})

</script>


<style lang="scss">
@import "@/assets/scss/variables.scss";

.view-section-container {
    height: 100%;
}

</style>