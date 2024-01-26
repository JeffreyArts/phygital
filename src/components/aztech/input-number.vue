<template>
    <div class="aztech-input-number" :class="[isDisabled ? '__isDisabled' : '']">
        <div class="aztec-input-number-text-container">
            <label class="aztech-input-number-text-label">{{ label }}</label>
            <div class="aztech-input-number-text-value-container">
                <svg class="aztech-input-number-svg __isDown" @click="onClick($event, -1)"
                     :class="[min && parseInt(value.toString(),10)-1 < parseInt(min,10) ? '__isDisabled' : '']"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                       viewBox="0 0 8 8"
                      xml:space="preserve">
                    <polygon class="aztech-input-number-up" points="0,0 8,0 4,8 "/>
                </svg>
                <span class="aztech-input-number-text-value">
                    {{ value }}
                </span>
                <span class="aztech-input-number-text-unit" v-if="unit">
                    {{ unit }}
                </span>
                <svg class="aztech-input-number-svg __isUp"
                     @click="onClick($event, 1)"
                     :class="[max && parseInt(value.toString(),10)+1 > parseInt(max,10) ? '__isDisabled' : '']"
                     version="1.1"
                     xmlns="http://www.w3.org/2000/svg"
                     xmlns:xlink="http://www.w3.org/1999/xlink"
                     x="0px"
                     y="0px"
                     viewBox="0 0 8 8"
                     xml:space="preserve">
                    <polygon class="aztech-input-number-up" points="0,8 4,0 8,8 "/>
                </svg>
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
        max: {
            type: String,
        },
        min: {
            type: String,
        },
    },
    data: () => {
        return {
            modelValueClone: "0" // Required because input makes it a string
        }
    },
    computed: {
        isDisabled() {
            return this.disabled
        },
        width() {
            if (this.value.toString().length == 1) {
                return 20
            } else if (this.value.toString().length == 2) {
                return 30
            }
            return 40
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
    watch: {
        modelValue:{
            handler() {
                this.modelValueClone = this.modelValue.toString()
            },
            immediate: true
        }
    },
    methods: {
        onClick(event:MouseEvent, value = 0) {
            const svgEl = event.currentTarget as HTMLElement
            if (!svgEl) return
            if (svgEl.classList.contains("__isDisabled")) {
                return
            }

            if (value > 0) {
                this.increase(value)
            } else {
                this.decrease(value)
            }
        },
        increase(value = 1) {
            if (this.disabled) return

            if (this.max) {
                if (this.modelValue + value > parseInt(this.max, 10)) {
                    return
                }
            }
            
            this.$emit("increase", this.modelValue + value)
        },
        decrease(value = -1) {
            if (this.disabled) return
            
            if (this.min) {
                if (this.modelValue + value < parseInt(this.min, 10)) {
                    return
                }
            }
            this.$emit("decrease", this.modelValue + value)
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
    padding-left: 16px;
    position: relative;
    &.__isDisabled {
        padding-left: 0;
        .aztech-input-number-svg {
            display: none;
        }
    }
}

.aztech-input-number-svg {
    width: 8px;
    position: absolute;
    left: 0;
    top: 8px;
    transition: opacity .32s ease;
    &.__isDown {
        top: 20px;
    }
    &.__isDisabled {
        opacity: .32;
    }
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

@media all and (pointer: coarse) {
    .aztech-input-number {
        padding-left: 0;
    }
    .aztech-input-number-svg {
        position: static;
        scale: 1.28;
    }
}
</style>