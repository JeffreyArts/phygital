import { defineStore } from "pinia"
import { io } from "socket.io-client"
import * as SocketIOClient from "socket.io-client"


export const socketIO = defineStore({
    id: "socketIO",
    state: () => ({
        socket: null as null | SocketIOClient.Socket,
        URL: import.meta.env.VITE_SOCKETIO
    }),
    actions: {
       
        emit(event:string, data:any) {
            if (!this.socket) {
                console.error("Init socket first")
                return
            }
            
            this.socket.emit(event, data)
        },        
        init() {
            this.socket = io(this.URL)
        }
    },
    getters: {
    }
})

export default socketIO