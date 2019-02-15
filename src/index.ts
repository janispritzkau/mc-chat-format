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
    } else if (component.translate) {
        const translation = translations[component.translate]
        if (!translation) return "[Missing translation]"
        const match = translation.match(/%([0-9]\$)?s/g)
        if (!match) return translation
        const order = match.map((x, i) => x.length == 2 ? i : parseInt(x[1]) - 1)
        return translation.split(/%(?:[0-9]\$)?s/).map((x, i) => {
            return i == 0 ? x : chatToText(component.with[order[i - 1]]) + x
        }).join("")
    }
    throw new Error("Unknown component type: " + JSON.stringify(component))
}
