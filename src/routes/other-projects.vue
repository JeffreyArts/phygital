<template>
    <div class="other-projects">
        <h1>_ other projects</h1>

        <div class="other-projects-container">
            <iframe-container src="https://www.jeffreyarts.nl/projects" />
        </div>
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import App from "@/stores/app"
import IframeContainer from "@/components/iframe-container.vue"

export default defineComponent ({ 
    name: "other-projects",
    components: {
        IframeContainer
    },
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
        document.title = "Phygital - Other projects" 
        this.app.activeView = ""
    },
    methods: {
        
    }
})

</script>


<style lang="scss">
@import "@/assets/scss/variables.scss";

.other-projects {
    width: 100%;
    overflow-y: auto;
    height: 100%;
    // padding-right: 64px;

    // max-width: calc(100% - 16px);
}
.other-projects-container {
    height:calc(100% - 80px);
}


</style>