import { defineStore } from "pinia"
import axios from "axios"
import dayjs from "dayjs"
import jwt_decode from "jwt-decode"
import { StrapiHTTPHeader, StrapiUser, StrapiAuthenticationError } from "@/types/strapi-store"


const _setUrl = () :string => {
    // Set url
    let url = import.meta.env.VITE_STRAPI_REST_ENDPOINT
    // if last char is a slash, remove it
    if (url[url.length - 1] === "/") {
        url = url.slice(0, -1)
    }
    
    // if first char is not a slash, add it
    if (import.meta.env.VITE_STRAPI_REST_ENDPOINT[0] !== "/") {
        url = `${url}/`
    } 

    url += import.meta.env.VITE_STRAPI_REST_ENDPOINT
    
    if (url[url.length - 1] === "/") {
        url = url.slice(0, -1)
    }
    
    return url
}

const _validateAuthToken = (token:string) : boolean => {
    if (token) {
        const authData = jwt_decode(token) as {
            exp: number,
            iat: number,
            id: number
        }
        
        if (authData) {
            // get difference in minutes
            const expiration = authData.exp -  Math.floor(Date.now() / 1000)
            return expiration > 0
        }
    }
    return false
}

export const Strapi = defineStore({
    id: "strapi",
    state: () => ({
        url: "",
        self: undefined as undefined | StrapiUser,
        authToken: null as null | string
    }),
    actions: {
        init() {
            this.url = _setUrl()
            this.authToken = localStorage.getItem("auth_token")

            if (this.authToken) {
                if (_validateAuthToken(this.authToken)) {
                    this.GET("/users/me").then(res => {
                        this.self = res.data
                    }).catch(() => {
                        this.self = undefined
                        this.authToken = null
                    })
                } else {
                    this.self = undefined
                    this.authToken = null
                }
            }
        },
        GET(path: string) {
            return this.REST("GET", path)
        },
        DELETE(path: string) {
            return this.REST("DELETE", path)
        },
        POST(path: string, data?: any) {
            return this.REST("POST", path, data)
        },
        PUT(path: string, data?: any) {
            return this.REST("PUT", path, data)
        },
        REST(method: string, path: string, data?: any) {
            const headers = {
                "Content-Type": "application/json",
            } as StrapiHTTPHeader

            if (path[0] === "/") {
                path = path.slice(1)
            }

            if (this.authToken) {
                headers["Authorization"] = `Bearer ${this.authToken}`
            }
            
            const request = {
                method: method,
                headers: headers
            } as {
                method: string, 
                headers?: StrapiHTTPHeader, 
                data?: any
            }

            if (data) {
                request.data = JSON.stringify(data, null, 2)
            }
            return axios(`${this.url}/${path}`, request)

        },
        _saveUserData(response: any) {
            localStorage.setItem("auth_token", response.data.jwt)
            this.self = response.data.user
            this.authToken = response.data.jwt
        },
        authenticateUser(identifier: string, password: string) {
            const errorMessages = {
                missing_credentials: "Please enter your username and password",
                missing_username: "Please enter your username",
                missing_password: "Please enter your password",
                invalid_credentials: "Invalid username or password",
                not_confirmed:  "Please confirm your email address first",
                blocked:  "Your account has been blocked, please contact an administrator",
                unknown: "Unknown server error, please try again later"
            }
            let error: StrapiAuthenticationError | undefined

            return new Promise(async (resolve, reject) => {
                try {
                    const response = await this.POST("/auth/local", {
                        identifier: identifier,
                        password: password
                    })
    
    
                    if (!response.data) {
                        throw {
                            type: "unknown",
                            message: errorMessages["unknown"],
                            details: "Missing response data"
                        }
                    }

                    if (!response.data.user.confirmed) {
                        error = {
                            type: "not_confirmed",
                            message: errorMessages["not_confirmed"]
                        }
                    }
    
                    if (response.data.user.blocked) {
                        error = {
                            type: "blocked",
                            message: errorMessages["blocked"]
                        }
                    }
                    
                    if (error && error.type) {
                        throw error
                    }
    
                    this._saveUserData(response)
                    resolve(response.data)
    
                } catch (err: any) {
    
                    if (err.response && err.response.data && err.response.data.error) {
                        const serverError = err.response.data.error
                
                        if (serverError.details && serverError.details.errors && serverError.details.errors.length === 2) {
                            error = {
                                type: "missing_credentials",
                                message: errorMessages["missing_credentials"]
                            }
                        } else if (serverError.details && serverError.details.errors && serverError.details.errors.length === 1) {
                            if (serverError.details.errors[0].message.includes("password")) {
                                error = {
                                    type: "missing_password",
                                    message: errorMessages["missing_password"]
                                }
                            } else {
                                error = {
                                    type: "missing_username",
                                    message: errorMessages["missing_username"]
                                }
                            }
                        } else {
                            error = {
                                type: "invalid_credentials",
                                message: errorMessages["invalid_credentials"]
                            }
                        }
                    }
                    reject(error)
                }
            })
        },
        registerUser(username:string, email: string, password:string) {
            const errorMessages = {
                missing_required_fields: "Missing required fields",
                invalid_email: "Please enter a valid e-mailaddress",
                duplicate_entry: "An user already exist with this e-mailaddres or username",
                not_confirmed: "To complete your registration, please confirm your account via the e-mail we have send you to the provided e-mailaddress",
                unknown: "Unknown server error, please try again later"
            }
            let error: StrapiAuthenticationError | undefined

            return new Promise(async (resolve, reject) => {
                try {
                    const response = await this.POST("/auth/local/register", {
                        username: username,
                        email: email,
                        password: password
                    })
    
    
                    if (!response.data) {
                        throw {
                            type: "unknown",
                            message: errorMessages["unknown"],
                            details: "Missing response data"
                        }
                    }

                    // You can remove this check if you want the user to automatically login after registration
                    if (!response.data.user.confirmed) {
                        error = {
                            type: "not_confirmed",
                            message: errorMessages["not_confirmed"]
                        }
                    }
    
                    if (error && error.type) {
                        throw error
                    }
    
                    this._saveUserData(response)
                    resolve(response.data)
    
                } catch (err: any) {
    
                    if (err.response && err.response.data && err.response.data.error) {
                        const serverError = err.response.data.error
                        
                        if (serverError.message.toLowerCase().includes("required")) {
                            error = {
                                type: "missing_required_fields",
                                message: errorMessages["missing_required_fields"],
                                details: []
                            }
                            for (const err of serverError.details.errors) {
                                error.details.push(err.path[0])
                            }
                        } else if (serverError.message.toLowerCase().includes("valid email")) {
                            
                            error = {
                                type: "invalid_email",
                                message: errorMessages["invalid_email"]
                            }
                            
                        } else if (serverError.name === "ApplicationError" && serverError.message.includes("taken")) {
                            
                            error = {
                                type: "duplicate_entry",
                                message: errorMessages["duplicate_entry"]
                            }
                            
                        } else if (serverError.name === "ValidationError" && serverError.message.includes("at least")) {

                            error = {
                                type: "invalid_password_length",
                                message: serverError.message
                            }
                            
                        } else {
                            error = {
                                type: "unknown",
                                message: errorMessages["unknown"]
                            }
                        }
                    }
                    reject(error)
                }
            })
        },
        requestPasswordReset(email: string) {
            const errorMessages = {
                missing_required_fields: "Missing required fields",
                invalid_email: "Please enter a valid e-mailaddress",
                unknown: "Unknown server error, please try again later"
            }
            let error: StrapiAuthenticationError | undefined

            return new Promise(async (resolve, reject) => {
                try {
                    const response = await this.POST("/auth/forgot-password", {
                        email: email
                    })
    
    
                    if (!response.data) {
                        throw {
                            type: "unknown",
                            message: errorMessages["unknown"],
                            details: "Missing response data"
                        }
                    }
    
                    if (error && error.type) {
                        throw error
                    }
    
                    resolve(response.data)
    
                } catch (err: any) {
    
                    if (err.response && err.response.data && err.response.data.error) {
                        const serverError = err.response.data.error
                        
                        if (serverError.message.toLowerCase().includes("valid email")) {
                            error = {
                                type: "invalid_email",
                                message: errorMessages["invalid_email"],
                                details: []
                            }
                            for (const err of serverError.details.errors) {
                                error.details.push(err.path[0])
                            }
                        } else if (serverError.message.toLowerCase().includes("required")) {
                            error = {
                                type: "missing_required_fields",
                                message: errorMessages["missing_required_fields"],
                                details: []
                            }
                            for (const err of serverError.details.errors) {
                                error.details.push(err.path[0])
                            }
                        } else {
                            error = {
                                type: "unknown",
                                message: errorMessages["unknown"]
                            }
                        }
                    }
                    reject(error)
                }
            })
        },
        resetPassword(password: string, code: string) {
            const errorMessages = {
                missing_required_fields: "Missing required fields",
                incorrect_code: "The provided code is (no longer) valid",
                duplicate_entry: "An user already exist with this e-mailaddres or username",
                not_confirmed: "To complete your registration, please confirm your account via the e-mail we have send you to the provided e-mailaddress",
                unknown: "Unknown server error, please try again later"
            }
            let error: StrapiAuthenticationError | undefined

            return new Promise(async (resolve, reject) => {
                try {
                    const response = await this.POST("/auth/reset-password", {
                        code: code,
                        passwordConfirmation: password,
                        password: password
                    })
    
    
                    if (!response.data) {
                        throw {
                            type: "unknown",
                            message: errorMessages["unknown"],
                            details: "Missing response data"
                        }
                    }
    
                    if (error && error.type) {
                        throw error
                    }
    
                    this._saveUserData(response)
                    resolve(response.data)
    
                } catch (err: any) {
    
                    if (err.response && err.response.data && err.response.data.error) {
                        const serverError = err.response.data.error
                        
                        if (serverError.message.toLowerCase().includes("incorrect code")) {
                            error = {
                                type: "incorrect_code",
                                message: errorMessages["incorrect_code"],
                            }
                        } else {
                            error = {
                                type: "unknown",
                                message: errorMessages["unknown"]
                            }
                        }
                    }
                    reject(error)
                }
            })
        },
        logout() {
            this.self = undefined
            this.authToken = null
            localStorage.removeItem("auth_token")
        }
    },
    getters: {
    }
}) as any

export default Strapi 