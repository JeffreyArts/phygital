<template>
    <div class="iframe-container" ref="container">
        <header class="iframe-container-header">
            <span class="iframe-container-header-fake-button"></span>
            <span class="iframe-container-header-fake-button"></span>
            <span class="iframe-container-header-fake-button"></span>
            <a :href="src" target="_blank" class="iframe-container-header-title">{{ cleanUrl }}</a>
        </header>
        <section class="iframe-container-content">
            <iframe class="iframe-content" :src="src" />
        </section>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
    name: "pgygital-surfaces-grid",
    components: {
    },
    props: {
        src: {
            type: String,
            default: "",
            required: true
        }
    },
    data: () => {
        return {
        }
    },
    computed: {
        cleanUrl() {
            let url = this.src.replace("http://","")
            url = url.replace("https://","")
            
            return url.split("/")[0]
        }
    },
    methods: {
      
    }
})
</script>

<style lang="scss">
@import "@/assets/scss/variables.scss";
.iframe-container {
    width: 100%;
    height: 100%;
    display: flex;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #DBDBDB;
    box-shadow: rgba(0,0,0,.016) -8px 24px 16px, rgba(0,0,0,.016) 8px 24px 16px;
    flex-flow: column;
}
.iframe-container-header {
    position: relative;
    width: 100%;
    background-color:#DBDBDB;
    border-radius: 8px  8px 0 0;
    gap: 6px;
    height: 28px;
    display: flex;
    justify-content: flex-start;
    align-items:center;
}
.iframe-container-header-title {
    opacity: .24;
    font-style: italic;
    position: absolute;
    left: 50%;
    top: 50%;
    translate: -50% -50%;
    color: currentColor;
    text-decoration: none;
    transition: .32s all ease;
    cursor: pointer;
    
    &:hover,
    &:focus {
        opacity: 1;
        text-decoration: underline;
    }
}
    
.iframe-container-header-fake-button {
    &:first-child {
        margin-left: 24px;
    }
    border-radius: 100%;
    width: 8px;
    height: 8px;
    background-color: currentColor;
    opacity: .5;
}

.iframe-container-content {
    height: 100%;
    iframe {
        border: 0 none transparent;
        width: 100%;
        height: 100%;
    }
}
</style>
