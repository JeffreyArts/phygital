<template>
    <div class="app-options-section" ref="container">
        <div class="app-options-option">
            <aztech-input-toggle v-model="tips" label="Show tips" @update="toggleTips" />
        </div>
        <div class="app-options-option">
            <aztech-input-toggle v-model="animations" label="Show animations" @update="toggleAnimation" />
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import PhygitalStore from "@/stores/phygital"
import AppStore from "@/stores/app"
import gsap from "@/services/gsap-wrapper"
import Cookies from "js-cookie"
import AztechInputToggle from "@/components/aztech/input-toggle.vue"

export default defineComponent({
    name: "app-options",
    components: {
        AztechInputToggle
    },
    props: {
        character: {
            type: String,
            required: false,
            default: "-"
        },
    },
    setup() {
        const phygital = PhygitalStore()
        const app = AppStore()

        return {
            phygital, app
        }
    },
    data: () => {
        return {
            tips: true,
            animations: true
        }
    },
    mounted() {
        this.tips = this.app.showTips
        this.animations = this.app.showAnimations
        if (this.app.showTips) {
            this.showTips()
        } else {
            this.hideTips()
        }
    },
    methods: {
        toggleTips() {
            this.tips = !this.tips
            if (this.tips) {
                this.showTips()
            } else {
                this.hideTips()
            }
            Cookies.set("showTips", this.tips.toString(), { sameSite: "strict" })
            this.app.showTips = this.tips
        },
        toggleAnimation() {
            this.animations = !this.animations
            this.app.showAnimations = this.animations
            Cookies.set("showAnimations", this.animations.toString(), { sameSite: "strict" })
        },
        showTips() {
            this.app.tutMessages.seedSection = true
            this.app.tutMessages.metaDimensionsSection = true
            this.app.tutMessages.viewEditSection = true
        },
        hideTips() {
            this.app.tutMessages.seedSection = false
            this.app.tutMessages.metaDimensionsSection = false
            this.app.tutMessages.viewEditSection = false
            
        }
    }
})
</script>

<style lang="scss" >
@import "@/assets/scss/variables.scss";
.app-options-section {
    position: relative;
    display: flex;
    flex-flow: column;
    padding: 0;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.app-options-option {
    + .app-options-option {
        margin-top: 8px;
    }
}

</style>
