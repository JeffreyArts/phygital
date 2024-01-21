<template>
    <div class="surface-dimensions-section" ref="container">

        <div class="surface-dimensions">
            <aztech-input-number v-model="width" label="width" @update="modifyWidth" @increase="modifyWidth" @decrease="modifyWidth"/>
            <aztech-input-number v-model="height" label="height" @update="modifyHeight" @increase="modifyHeight" @decrease="modifyHeight"/>
        </div>
        <aztech-alert :options="options" :open="alertOpen" @close="closeAlert" >
            Changing this property will make you lose all of your changes. Are you sure you want to continue?
        </aztech-alert>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import PhygitalStore from "@/stores/phygital"
import AppStore from "@/stores/app"
import AztechAlert from "@/components/aztech/alert.vue"
import AztechInputNumber from "@/components/aztech/input-number.vue"
import type { AztechAlertOption } from "@/types/aztech-alert"

export default defineComponent({
    name: "surface-dimensions",
    components: {
        AztechAlert,
        AztechInputNumber,
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
            phygital,app
        }
    },
    data: () => {
        return {
            alertOpen: false,
            options: [] as Array<AztechAlertOption>
        }
    },
    computed: {
        width() {
            switch (this.app.activeSurface) {
            case "top":
            case "bottom":
                return this.phygital.surfaces.top.width
            case "front":
            case "back":
                return this.phygital.surfaces.front.width
            case "left":
            case "right":
                return this.phygital.surfaces.left.width
            }
            return 0
        },
        height() {
            switch (this.app.activeSurface) {
            case "top":
            case "bottom":
                return this.phygital.surfaces.top.height
            case "front":
            case "back":
                return this.phygital.surfaces.front.height
            case "left":
            case "right":
                return this.phygital.surfaces.left.height
            }
            return 0
        },
    },
    mounted() {
        this.options.push( {
            label: "Continue",
            type: "primary",
            onClick: () => {/* will be set in this.validateChange()  */}
        })
        this.options.push( {
            label: "Cancel",
            type: "",
            onClick: () => {
                this.closeAlert()
            }
        })
    },
    methods: {
        closeAlert() {
            this.alertOpen = false
        },
        validateChange(dimension: "width" | "height", value: number) {
            this.alertOpen = true
            if (dimension == "width") {
                this.options[0].onClick = () => {
                    this.modifyWidth(value,true)
                    this.phygital.seed = this.phygital.originalSeed
                    this.closeAlert()
                }
            } else {
                this.options[0].onClick = () => {
                    this.modifyHeight(value,true)
                    this.phygital.seed = this.phygital.originalSeed
                    this.closeAlert()
                }
            }
        },
        modifyWidth(v:number, skipAlert=false) {
            const seedDom = document.querySelectorAll(".seed-value")[0] as HTMLElement
            const seed = seedDom.innerText.split("\n")[0].trim()
            if (seed === "custom" && !skipAlert) {
                return this.validateChange("width",v)
            }

            switch (this.app.activeSurface) {
            case "top":
            case "bottom":
                this.phygital.surfaces.top.width = v
                this.phygital.surfaces.bottom.width = v
                this.phygital.surfaces.front.width = v
                this.phygital.surfaces.back.width = v

                break
            case "front":
            case "back":
                this.phygital.surfaces.front.width = v
                this.phygital.surfaces.back.width = v
                this.phygital.surfaces.top.width = v
                this.phygital.surfaces.bottom.width = v
                break   
            case "left":
            case "right":
                this.phygital.surfaces.left.width = v
                this.phygital.surfaces.right.width = v
                this.phygital.surfaces.top.height = v
                this.phygital.surfaces.bottom.height = v
                break
            }

            this.phygital.updateSurfaces()
        },
        modifyHeight(v:number, skipAlert=false) {
            const seedDom = document.querySelectorAll(".seed-value")[0] as HTMLElement
            const seed = seedDom.innerText.split("\n")[0].trim()
            if (seed === "custom" && !skipAlert) {
                return this.validateChange("height",v)
            }
            // this.phygital.generateSeed()
            
            switch (this.app.activeSurface) {
            case "top":
            case "bottom":
                this.phygital.surfaces.top.height = v
                this.phygital.surfaces.bottom.height = v
                this.phygital.surfaces.left.width = v
                this.phygital.surfaces.right.width = v
                break
            case "front":
            case "back":
                this.phygital.surfaces.front.height = v
                this.phygital.surfaces.back.height = v
                this.phygital.surfaces.left.height = v
                this.phygital.surfaces.right.height = v
                break
            case "left":
            case "right":
                this.phygital.surfaces.left.height = v
                this.phygital.surfaces.right.height = v
                this.phygital.surfaces.front.height = v
                this.phygital.surfaces.back.height = v
                break
            }

            this.phygital.updateSurfaces()
        }
    }
})
</script>

<style lang="scss" >
@import "@/assets/scss/variables.scss";
.surface-dimensions-section {
    position: relative;
    display: flex;
    flex-flow: column;
    padding: 0;
    justify-content: space-between;
    width: 100%;
    height: 100%;
}

</style>
