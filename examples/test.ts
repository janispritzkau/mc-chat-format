import { chatToText } from "../lib"

console.log(chatToText({
    extra:
        [{ color: "gold", text: "Position in queue: " },
        { color: "gold", bold: true, text: "92" }],
    text: ""
}))

console.log(chatToText({
    translate: "chat.type.text",
    with: ["Notch", "Hello!"]
}))

console.log(chatToText({
    translate: "death.attack.cramming.player",
    with: ["Evanry", { translate: "block.minecraft.diorite" }]
}))
