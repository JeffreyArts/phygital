<!-- 
use the .ascii-box-content for styling the content inside the box. Best way is to style it via the parent component/route that you put this element in.
 -->

<template>
    <div class="register-form-container">
        <form class="register-form" @submit="submitForm">
            <div class="register-form-field">
                <label for="">E-mailadres</label>
                <input type="text" v-model="email">
            </div>
            <div class="register-form-field">
                <label for="">Username</label>
                <input type="text" v-model="username">
            </div>
            <div class="register-form-field">
                <label for="">Password</label>
                <input type="password" v-model="password" minlength="6">
            </div>
            <div class="register-form-field">
                <button type="submit">
                    Register
                </button>
            </div>
        </form>
        <div class="register-form-error" v-if="error">
            <p v-html="error.message" />
        </div>    
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import strapiStore from "@/stores/strapi"


export default defineComponent({
    name: "register-form",
    props: {
        character: {
            type: String,
            required: false,
            default: "─"
        },
    },
    setup() {
        const Strapi = strapiStore()
        return { Strapi }
    },
    data: () => {
        return {
            username: "",
            email: "",
            password: "",
            error: null as null | {message: string},
            errorMessages: {
                missing_credentials: "Please enter your username and password",
                missing_username: "Please enter your username",
                missing_password: "Please enter your password",
                invalid_credentials: "Invalid username or password",
                unknown: "Unknown server error, please try again later"
            }
            
        }
    },
    methods: {
        submitForm($event: Event) {
            $event.preventDefault()
            this.error = null

            this.Strapi.registerUser(this.username, this.email, this.password)
                .then()
                .catch(err => {
                    console.log(err)
                    this.error =  err
                })
            this.$emit("registerSuccess")
        },
    }
})
</script>

<style lang="scss" scoped>

</style>
