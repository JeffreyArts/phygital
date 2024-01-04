import { defineStore } from "pinia"

export type ViewState = "cube-3d" | "cube-faces"
export type OrientationType = "landscape" | "portrait"

interface AppState {
  activeView: ViewState;
  orentation: OrientationType
}


export const AppState = defineStore({
    id: "appStates",
    state: () => ({
        activeView: "cube-3d",
        orentation: "landscape"
    }),
    actions: {
        
    },
    getters: {
    }
}) 

export default AppState