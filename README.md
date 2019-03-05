# Minecraft Chat Formatter

```js
import { format, convert, flatten } from "mc-chat-format"

format({
    translate: "death.attack.player.item",
    with: ["jeb_", "Notch", { translate: "item.minecraft.wooden_shovel" }]
})
// ⮡ 'jeb_ was slain by Notch using Wooden Shovel'

flatten({ text: "1 ", extra: [{ text: "2", extra: [{ text: " 3" }] }] })
// ⮡ [ { text: '1 ' }, { text: '2' }, { text: ' 3' } ]

convert({
    translate: "block.minecraft.comparator",
    bold: true,
    insertion: "Test"
}, { stripNonText: true })
// ⮡ { text: 'Redstone Comparator', bold: true }
```
