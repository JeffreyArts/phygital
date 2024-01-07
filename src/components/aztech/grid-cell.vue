<template>
    <div class="aztech-grid-cell" :class="[
        hasLeft ? '__hasLeft': '',
        hasRight ? '__hasRight': '',
        hasTop ?'__hasTop': '',
        hasBottom ?'__hasBottom': '',
        ]">
        <svg v-for="(c,i) in corners" class="aztech-grid-cell-corner" :key="i" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve">
            <polygon v-if="c == '└'" class="bottom-left"    points="6.4,9.6 6.4,6.4 6.4,1.6 8,0  9.6,1.6 9.6,6.4 14.4,6.4 16,8 14.4,9.6 9.6,9.6 6.4,9.6 "/>
            <polygon v-if="c == '┘'" class="bottom-right"   points="9.6,9.6 6.4,9.6 1.6,9.6 0,8 1.6,6.4 6.4,6.4 6.4,1.6 8,0 9.6,1.6 9.6,6.4 9.6,9.6  "/>
            <polygon v-if="c == '┐'" class="top-right"      points="9.6,6.4 9.6,9.6 9.6,14.4 8,16 6.4,14.4 6.4,9.6 1.6,9.6 0,8 1.6,6.4 6.4,6.4 9.6,6.4  "/>
            <polygon v-if="c == '┌'" class="top-left"       points="6.4,6.4 9.6,6.4 14.4,6.4 16,8 14.4,9.6 9.6,9.6 9.6,14.4 8,16 6.4,14.4 6.4,9.6 6.4,6.4 "/>
        </svg>
        <slot />
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"


export default defineComponent({
    name: "aztech-grid-cell",
    data: () => {
        return {
            corners: ["┌","┐","┘","└"] as Array<"┌" | "┐" | "└" | "┘" | "┬" | "┴" | "┤" | "├" | "┼">, 
            hasLeft: false,
            hasRight: false,
            hasTop: false,
            hasBottom: false,
        }
    },
    mounted() {
        this.findAdjacentGridCells()
        window.addEventListener("resize", this.findAdjacentGridCells)
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.findAdjacentGridCells)
    },
    methods: {
        findAdjacentGridCells(): Array<"┌" | "┐" | "└" | "┘" | "┬" | "┴" | "┤" | "├" | "┼"> {
            const el = this.$el as HTMLElement
            if (!el) return ["┌","┐","┘","└"] 
            
            const corners = ["┌","┐","┘","└"] as Array<"┌" | "┐" | "└" | "┘" | "┬" | "┴" | "┤" | "├" | "┼">
            const center = el.getBoundingClientRect()
            
            const leftElement   = document.elementFromPoint(center.x - center.width, center.y)
            const rightElement  = document.elementFromPoint(center.x + center.width, center.y)
            const topElement    = document.elementFromPoint(center.x, center.y - center.height)
            const bottomElement = document.elementFromPoint(center.x, center.y + center.height)
            
            this.hasLeft   = !!(leftElement   && this.isGridCell(leftElement))
            this.hasRight  = !!(rightElement  && this.isGridCell(rightElement))
            this.hasTop    = !!(topElement    && this.isGridCell(topElement))
            this.hasBottom = !!(bottomElement && this.isGridCell(bottomElement))

            return corners
        },
        isGridCell(el: Element | undefined) {
            if (!el) {
                return false
            }
            let parent = el.parentElement
            while(parent && !parent.classList.contains("aztech-grid-cell") && parent.parentElement) {
                parent = parent.parentElement
                if (parent.classList.contains("aztech-grid-cell")) {
                    return true
                }
            }
            return false
        }
    }
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

.aztech-grid-cell {
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1 / 1;
    position: relative;
    border: 1px solid $dark-grey;
    &.__hasLeft {
        border-left: none;
    }
    &.__hasTop {
        border-top: none;
    }
}
.aztech-grid-cell-corner {
    position: absolute;
    height: 16px;
    width: 16px;
    z-index: 1;

    &:nth-child(1) {
        top: -8.5px;
        left: -8.5px;
    }
    &:nth-child(2) {
        top: -8.5px;
        right: -8.5px;
    }
    &:nth-child(3) {
        bottom: -8.5px;
        right: -8.5px;
    }
    &:nth-child(4) {
        bottom: -8.5px;
        left: -8.5px;
    }
    polygon {
        fill: $dark-grey;
    }
}
</style>