import { chatToText, Translation } from "../lib"

const de_de: Translation = require("./de_de.json")

console.log(chatToText({
    translate: "death.attack.onFire.player",
    with: ["CorruptKnight", "Volcagnome"]
}, de_de))
