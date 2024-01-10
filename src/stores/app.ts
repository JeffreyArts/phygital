import { defineStore } from "pinia"

export type ViewState = "cube-3d" | "cube-faces"
export type OrientationType = "landscape" | "portrait"
type Surfaces = "top" | "bottom" | "left" | "right" | "front" | "back"

interface AppState {
  activeView: ViewState;
  orentation: OrientationType,
  activeSurface: Surfaces,
  editMode: boolean,
}


export const AppState = defineStore({
    id: "appStates",
    state: () => ({
        activeView: "cube-3d",
        orentation: "landscape",
        activeSurface: "front",
        editMode: false
    }),
    actions: {
    },
    getters: {
    }
}) 

export default AppState