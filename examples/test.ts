import { format, flatten, convert } from "../src"

console.log(format({
    extra:
        [{ color: "gold", text: "Position in queue: " },
        { color: "gold", bold: true, text: "92" }],
    text: ""
}, { useAnsiCodes: true }))

console.log(format({
    translate: "chat.type.text",
    with: ["Notch", "Hello!"]
}))

console.log(format({
    translate: "death.attack.cramming.player",
    with: ["Evanry", { translate: "block.minecraft.diorite" }]
}))

console.log(format({ text: `
§r§0k §kMinecraft
§rl §lMinecraft
§rm §mMinecraft
§rn §nMinecraft
§ro §oMinecraft
§rr §rMinecraft
`}, { useAnsiCodes: true }))

console.log(flatten({ text: "", bold: true, extra: [
    { text: "Hello ", extra: [
        { text: "world!", bold: false, italic: true }
    ] }
] }))

console.log(convert({
    text: "§00§11§22§33§44§55§66§77§88§99§aa§bb§cc§dd§ee§ff",
    underlined: true
}))
