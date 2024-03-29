import gsap from "gsap"
import appStore from "@/stores/app"
const gsapWrapper = {...gsap}

gsapWrapper.to = (
    target: gsap.TweenTarget,
    durationOrVars: number | gsap.TweenVars,
    vars?: gsap.TweenVars
) => {
    let options = {} as gsap.TweenVars

    if (typeof durationOrVars === "number") {
        options.duration = durationOrVars
    } else {
        vars = durationOrVars
    }

    options = {
        ...options,
        ...vars,
    } as gsap.TweenVars

    // Pinia datastore
    const app = appStore()

    // Overwrite duration & delay when animations are not allowed
    if (!app.showAnimations) {
        options.duration = 0
        options.delay = 0
        options.ease = "none"
        if (typeof options.stagger == "number") {
            options.stagger = 0
        } else if (typeof options.stagger === "object" && options.stagger !== null) {
            options.stagger.each = 0
        } 
    }

    // Fix for vite-ssg
    if (typeof gsap.to == "undefined") {
        return null as any as gsap.core.Tween
    }
    
    return gsap.to(target, options)
}

gsapWrapper.fromTo = (
    target: gsap.TweenTarget,
    durationOrFromVars: number | gsap.TweenVars,
    fromOrToVars: gsap.TweenVars,
    toVars?: gsap.TweenVars
) => {
    let options = {} as gsap.TweenVars

    let fromVars = fromOrToVars
    if (typeof durationOrFromVars === "number") {
        options.duration = durationOrFromVars
        fromVars = fromOrToVars
    } else {
        toVars = fromOrToVars
        fromVars = durationOrFromVars
    }

    options = {
        ...options,
        ...toVars,
    } as gsap.TweenVars

    // Pinia datastore
    const app = appStore()
    
    // Overwrite duration & delay when animations are not allowed
    if (!app.showAnimations) {
        options.duration = 0
        options.delay = 0
        options.ease = "none"
        if (typeof options.stagger == "number") {
            options.stagger = 0
        } else if (typeof options.stagger === "object" && options.stagger !== null) {
            options.stagger.each = 0
        } 
    }

    return gsap.fromTo(target, {
        ...fromVars,
    }, options)
}

export default gsapWrapper
