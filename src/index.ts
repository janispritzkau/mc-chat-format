const translations: { [key: string]: string } = require("../assets/en_us.json")

export function chatToText(component: any): string {
    if (component == null) {
        return ""
    } else if (typeof component == "string") {
        return component
    } else if (component instanceof Array) {
        return component.map(x => chatToText(x)).join("")
    } else if (component.text != null) {
        return component.text + chatToText(component.extra)
    } else if (component.translation) {
        return translations[component.translation].split("%s").map((x, i) => {
            return i == 0 ? x : component.with[i - 1] + x
        }).join("")
    }
    throw new Error("Unknown component type: " + JSON.stringify(component))
}
