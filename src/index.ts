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
    maxLineLength?: number
}

/**
 * Converts a Minecraft chat component to a formatted string.
 * */
export function format(component: Component, options: FormatOptions = {}) {
    const text = formatString(convert(component, options), options.useAnsiCodes)

    if (options.maxLineLength) {
        let t = "", e = false, l = 0
        for (let c of text) {
            if (c == "\x1b") e = true
            else if (c == "m") e = false
            else if (c == "\n") l = 0
            t += c
            if (l == options.maxLineLength) t += "\n", l = 0
            if (!e) l += 1
        }
        return t
    } else return text
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

    if (extra) array.push(
        ...flattenArray(extra.map(c => {
            if (typeof c == "string") return [{ text: c, ...rest }]
            if (!('text' in c)) throw new Error("Not a StringComponent")

            return flatten(c).map(c => ({ ...c, ...rest, ...c }))
        }))
    )

    return array
}

/** Converts a `StringComponent` to plain text and can format it using ANSI codes. */
export function formatString(component: StringComponent, useAnsiCodes = false) {
    let text = flatten(component).map((c) => {
        if (!useAnsiCodes) return c.text
        let codes = colorToAnsiCode(c.color)
        if (c.bold) codes += "\x1b[1m"
        if (c.italic) codes += "\x1b[3m"
        if (c.underlined) codes += "\x1b[4m"
        if (c.strikethrough) codes += "\x1b[9m"
        return codes ? codes + c.text + "\x1b[0m" : c.text
    }).join("")

    if (!useAnsiCodes) return text

    const resetCodes = new Set<string>()

    text =  text.split(/§(.)/).map((t, i) => {
        if (i % 2 == 0) return t
        else switch (t) {
            case "l": resetCodes.add("\x1b[22m"); return "\x1b[1m"
            case "m": resetCodes.add("\x1b[29m"); return "\x1b[9m"
            case "n": resetCodes.add("\x1b[24m"); return "\x1b[4m"
            case "o": resetCodes.add("\x1b[23m"); return "\x1b[3m"
            case "r": resetCodes.clear();         return "\x1b[0m"
            case "k": t = ""; break
            case "0": t = "\x1b[38;2;0;0;0m"; break
            case "1": t = "\x1b[38;2;0;0;170m"; break
            case "2": t = "\x1b[38;2;0;170;0m"; break
            case "3": t = "\x1b[38;2;0;170;170m"; break
            case "4": t = "\x1b[38;2;170;0;0m"; break
            case "5": t = "\x1b[38;2;170;0;170m"; break
            case "6": t = "\x1b[38;2;255;170;0m"; break
            case "7": t = "\x1b[38;2;170;170;170m"; break
            case "8": t = "\x1b[38;2;85;85;85m"; break
            case "9": t = "\x1b[38;2;85;85;255m"; break
            case "a": t = "\x1b[38;2;85;255;85m"; break
            case "b": t = "\x1b[38;2;85;255;255m"; break
            case "c": t = "\x1b[38;2;255;85;85m"; break
            case "d": t = "\x1b[38;2;255;85;255m"; break
            case "e": t = "\x1b[38;2;255;255;85m"; break
            case "f": t = "\x1b[38;2;255;255;255m"; break
        }
        return t + [...resetCodes.values()].join("")
    }).join("")

    const index = text.lastIndexOf("\x1b[")
    if (index == -1) return text

    const code = text.slice(index + 2).match(/(.+)m/)![1]
    return code == "0" ? text : text + "\x1b[0m"
}

function colorToAnsiCode(color?: string) {
    let code = ""
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
    }
    return code && "\x1b[38;2;" + code + "m"
}

function flattenArray<T>(array: T[][]) {
    return (<T[]>[]).concat(...array)
}

/** @deprecated Use `format(convert(component))` instead */
export function chatToText(component: Component, translation?: Translation) {
    return format(component, { translation })
}
