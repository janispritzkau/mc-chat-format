import { format } from "../lib"

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
