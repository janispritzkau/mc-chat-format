import { chatToText } from "../lib"

console.log(chatToText({
    extra:
        [{ color: "gold", text: "Position in queue: " },
        { color: "gold", bold: true, text: "92" }],
    text: ""
}))

console.log(chatToText({
    translation: "chat.type.text",
    with: ["Notch", "Hello!"]
}))
