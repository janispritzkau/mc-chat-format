# mc-chat-format

Translate and convert Minecraft's chat components into plain text or a string component.

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

format({
    text: "§bHello §cworld",
    bold: true
}, { useAnsiCodes: true })
// ⮡ '\x1b[1m\x1b[38;2;85;255;255mHello \x1b[38;2;255;85;85mworld\x1b[0m'
```
