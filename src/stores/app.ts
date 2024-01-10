import { defineStore } from "pinia"

export type ViewState = "view-3d" | "view-surfaces"
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
        activeView: "view-3d",
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