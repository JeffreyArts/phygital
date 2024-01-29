import { defineStore } from "pinia"
import Cookies from "js-cookie"

export type ViewState = "view-3d" | "view-surfaces" | ""
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
        editMode: false,
        maxSurfaceWidth: 24,
        maxSurfaceHeight: 24,
        showTips: Cookies.get("showTips") == "false" ? false : true,
        showAnimations: Cookies.get("showAnimations") == "false" ? false : true,
        tutMessages: {
            viewEditSection: true,
            seedSection: true,
            metaDimensionsSection: true,
        }
    }),
    actions: {
    },
    getters: {
    }
}) 

export default AppState