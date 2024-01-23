<template>
    <div class="edit-options-section" ref="container">
        <div class="edit-options-option">
            <aztech-input-toggle v-model="mirroredEdit" label="Mirror edit" @update="toggleMirror" />
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import PhygitalStore from "@/stores/phygital"
import AztechInputToggle from "@/components/aztech/input-toggle.vue"

export default defineComponent({
    name: "edit-options",
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
        
        return {
            phygital
        }
    },
    data: () => {
        return {
            mirroredEdit: true,
        }
    },
    mounted() {
        this.mirroredEdit = this.phygital.mirroredEdit

    },
    methods: {
        toggleMirror() {
            this.mirroredEdit = !this.mirroredEdit
            this.phygital.mirroredEdit = this.mirroredEdit
        }
    }
})
</script>

<style lang="scss" >
@import "@/assets/scss/variables.scss";
.edit-options-section {
    position: relative;
    display: flex;
    flex-flow: column;
    padding: 0;
    justify-content: flex-end;
    width: 100%;
    height: 100%;
}

</style>
