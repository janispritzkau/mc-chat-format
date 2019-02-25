require("array.prototype.flat").shim()
const defaultTranslation: Translation = require("../assets/en_us.json")

export type Translation = { [key: string]: string }
export type Component = StringComponent | TranslationComponent | string

interface Shared {
    bold?: boolean
    italic?: boolean
    underlined?: boolean
    strikethrough?: boolean
    obfuscated?: boolean
    color?: string
    insertion?: string
    clickEvent?: any
    hoverEvent?: any
    extra?: Component[]
}

export interface StringComponent extends Shared {
    text: string
}

export interface TranslationComponent extends Shared {
    translate: string
    with?: Component[]
}

interface FormatOptions extends ConvertOptions {
    useAnsiCodes?: boolean
}

/**
 * Converts a Minecraft chat component to a formatted string.
 * */
export function format(component: Component, options: FormatOptions = {}) {
    return formatString(convert(component, options), options.useAnsiCodes)
}

interface ConvertOptions {
    translation?: Translation
    stripNonText?: boolean
    strict?: boolean
}

/**
 * Applies translations to a [Chat component](https://wiki.vg/Chat) and converts
 * it to `StringComponent`.
*/
export function convert(component: Component, options: ConvertOptions = {}): StringComponent {
    if (!options.translation) options.translation = defaultTranslation
    if (options.strict == null) options.strict = true

    if (typeof component == "string") return { text: component }

    if (component.extra) {
        component.extra = component.extra.map(x => convert(x, options))
    }

    if (options.stripNonText) {
        delete component.hoverEvent
        delete component.clickEvent
        delete component.insertion
    }

    if ("translate" in component) {
        const { translate, with: _with, ...rest } = component

        const translation = options.translation[translate]
        if (!translation) if (options.strict) throw new Error(`Couldn't find translation for ${translate}`)
        else return { text: "[Missing translation]", ...rest }

        const match = translation.match(/%([0-9]\$)?s/g)
        if (!match) return { text: translation, ...rest }

        const order = match.map((x, i) => x.length == 2 ? i : parseInt(x[1]) - 1)

        const parts = translation.split(/%([0-9]\$)?s/)
        const extra: Component[] = parts.map((x, i) => {
            if (i % 2 == 0) return { text: x }
            else return convert(_with![order[(i / 2) | 0]], options)
        }).filter(x => x.text.length > 0 || x.extra)

        if (rest.extra) extra.push(...rest.extra)

        return { text: "", ...rest, extra }
    } else {
        return component
    }
}

/** Flattens a nested `StringComponent` to an array. */
export function flatten(component: StringComponent): StringComponent[] {
    const { text, extra, ...rest } = component
    const array = [{ text, ...rest }]

    if (extra) array.push(...flattenArray(extra.map(x => flatten(<any>x).map(x => ({
        ...x, ...rest, ...x
    })))))

    return array
}

/** Converts a `StringComponent` to plain text and can format it using ANSI codes. */
export function formatString(component: StringComponent, useAnsiCodes = false) {
    return flatten(component).map(c => {
        if (!useAnsiCodes) return c.text
        let text = colorToAnsiCode(c.color)
        if (c.bold) text += "\x1b[1m"
        if (c.italic) text += "\x1b[3m"
        if (c.underlined) text += "\x1b[4m"
        if (c.strikethrough) text += "\x1b[9m"
        return text + c.text + "\x1b[0m"
    }).join("")
}

function colorToAnsiCode(color?: string) {
    let code = "\x1b[38;2;"
    switch (color) {
        case "black":        code += "0;0;0"; break
        case "dark_blue":    code += "0;0;170"; break
        case "dark_green":   code += "0;170;0"; break
        case "dark_aqua":    code += "0;170;170"; break
        case "dark_red":     code += "170;0;0"; break
        case "dark_purple":  code += "170;0;170"; break
        case "gold":         code += "255;170;0"; break
        case "gray":         code += "170;170;170"; break
        case "dark_gray":    code += "85;85;85"; break
        case "blue":         code += "85;85;255"; break
        case "green":        code += "85;255;85"; break
        case "aqua":         code += "85;255;255"; break
        case "red":          code += "255;85;85"; break
        case "light_purple": code += "255;85;255"; break
        case "yellow":       code += "255;255;85"; break
        case "white":        code += "255;255;255"; break
        default:             code = "\x1b[0"
    }
    return code + "m"
}

function flattenArray<T>(array: T[][]) {
    return (<T[]>[]).concat(...array)
}

/** @deprecated Use `format(convert(component))` instead */
export function chatToText(component: Component, translation?: Translation) {
    return format(component, { translation })
}
