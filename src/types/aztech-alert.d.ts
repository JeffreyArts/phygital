interface AztechAlertOption {
    label: string
    type: "primary" | "secondary" | ""
    onClick: (any) => void
}
declare module "@/components/aztech/alert.vue" {
    export {AztechAlertOption}
}

export {AztechAlertOption}