import gsap from "gsap"

const blurPlugin = {
    blurProperty: gsap.utils.checkPrefix("filter"),
    blurExp: /blur\((.+)?px\)/,
    getBlurMatch: (target:any) => {
        return ((gsap.getProperty(target, blurPlugin.blurProperty) || "") as string).match(blurPlugin.blurExp) || []
    },
    registerGet(target:any) {
        return +blurPlugin.getBlurMatch(target)[1] || 0
    },
    registerInit(target:any, endValue:string|number) {
        const a = this as any
        const match = blurPlugin.getBlurMatch(target)[0],
            endBlur = "blur(" + endValue + "px)"

        let filter = gsap.getProperty(target, blurPlugin.blurProperty).toString(),
            index
        if (filter === "none") {
            filter = ""
        }
        if (match) {
            index = filter.indexOf(match)
            endValue = filter.substr(0, index) + endBlur + filter.substr(index + match.length)
        } else {
            endValue = filter + endBlur
            filter += filter ? " blur(0px)" : "blur(0px)"
        }
        a.target = target
        a.interp = gsap.utils.interpolate(filter, endValue)
    },
    registerRender(progress:number|string, data:any) {
        data.target.style[blurPlugin.blurProperty] = data.interp(progress)
        window.requestAnimationFrame(() => {
            //
        })
    }
}

gsap.registerPlugin({
    name: "blur",
    get: blurPlugin.registerGet,
    init: blurPlugin.registerInit,
    render: blurPlugin.registerRender
})


export default blurPlugin
