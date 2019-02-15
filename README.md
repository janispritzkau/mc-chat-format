# Minecraft Chat Formatter

```js
import { chatToText } from "mc-chat-format"

chatToText({
    translate: "death.attack.player.item",
    with: ["jeb_", "Notch", { translate: "item.minecraft.wooden_shovel" }]
})
// ⮡ jeb_ was slain by Notch using Wooden Shovel
```

`chatToText` takes a [Chat component](https://wiki.vg/Chat) and returns a string
with the formatted output. Different translations can be given as second argument.
