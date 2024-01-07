<template>
    <div class="aztech-input-number" :class="[isDisabled ? '__isDisabled' : '']">
        <svg class="aztech-input-number-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  viewBox="0 0 8 20" xml:space="preserve" @click="onClick">
            <polygon class="aztech-input-number-down" points="8,12 4,20 0,12 8,12 "/>
            <polygon class="aztech-input-number-up" points="0,8 4,0 8,8 0,8 "/>
        </svg>
        <div class="aztec-input-number-text-container">
            <label class="aztech-input-number-text-label">{{ label }}</label>
            <div class="aztech-input-number-text-value-container">
                <span class="aztech-input-number-text-value">
                    {{ value }}
                </span>
                <span class="aztech-input-number-text-unit" v-if="unit">
                    {{ unit }}
                </span>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"


export default defineComponent({
    name: "aztech-input-number",
    props: {
        modelValue: {
            type: Number,
            required: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            default: "",
            required: true,
        },
        unit: {
            type: String,
        },
    },
    data: () => {
        return {
        }
    },
    computed: {
        isDisabled() {
            return this.disabled
        },
        value() {
            if (this.modelValue === Math.floor(this.modelValue)) {
                return this.modelValue
            } if (this.modelValue*10 === Math.floor(this.modelValue*10)) {
                return this.modelValue.toFixed(1)
            } if (this.modelValue*100 === Math.floor(this.modelValue*100)) {
                return this.modelValue.toFixed(2)
            }
            
            return this.modelValue.toFixed(1) + "x"
        }
    },
    methods: {
        onClick(event:MouseEvent) {
            const svgEl = event.currentTarget as HTMLElement
            if (!svgEl) return
            const d = svgEl.getClientRects()[0]
            const height = d.height
            const yPos = event.clientY - d.top
            if (yPos < height/2) {
                this.increase()
            } else {
                this.decrease()
            }
        },
        increase() {
            if (this.disabled) return
            this.$emit("increase", this.modelValue + 1)
            // this.modelValue++
        },
        decrease() {
            if (this.disabled) return
            
            this.$emit("decrease", this.modelValue - 1)
            // this.modelValue++
        },
    }
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

.aztech-input-number {
    display: flex;
    flex-flow: row;
    gap: 8px;
    &.__isDisabled {
        .aztech-input-number-svg {
            display: none;
        }
    }
}
.aztech-input-number-svg {
    width: 8px;
}

.aztec-input-number-text-container {
    display: flex;
    flex-flow: column;
    font-family: $defaultFont;
    font-size: 14px;
}
.aztech-input-number-text-value-container {
    display: flex;
    flex-flow: row;
    font-family: $accentFont;
    gap: 8px;
    font-size: 16px;
}

.aztech-input-number-down,
.aztech-input-number-up {
    transform-origin: center center;
    transition: ease .24s all;
    &:hover {
        transition: unset;
        scale:1.08;
        cursor: pointer;
    }
}
</style>