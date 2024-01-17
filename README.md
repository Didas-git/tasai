# Tasai

The most complete and flexible ansi coloring library.

## Why Tasai?

Tasai is the fastest full feature, dependency free terminal styling library.

- 4 different apis (includes drop in replacement for chalk)
- Support for bun macros
- No prototype pollution
- Support for nested colors and **doesn't** have the nested styling bug other libraries have.
- *Dependency free*

## Usage

### Chalk Drop-in Replacement

```ts
import { c } from "tasai";

console.log(c.blue('Hello world!'));
```

### Macro API

The macro api is all string based and was made during a fun discussing with @paperdave.

There are 3 different macros named according to the range of colors they support.

- 4bit - The 16 colors we are all used to.
- 8bit - 256 colors and 4bit colors.
- 24bit - All the rgb colors (and different color spaces), 8bit, and 4bit colors.

#### Usage

You need bun to use macros.

To mark a color you start with `<color>` and to tell where it ends you terminate with `<r>`.
The macro will try to get the closest `r` terminator but if it encounters a color it will expand.

##### 4Bit

```ts
import { parseUsing4BitColors } from "tasai" with { type: "macro" };

console.log(parseUsing4BitColors("<bg_black>Hello <cyan>World<r>!<r>"));
```

##### 8Bit

```ts
import { parseUsing8BitColors } from "tasai" with { type: "macro" };

console.log(parseUsing8BitColors("<bg_0>Hello <14>World<r>!<r>"));
```

##### 24Bit

```ts
import { parseUsing24BitColors } from "tasai" with { type: "macro" };

console.log(parseUsing8BitColors("<bg_#00000>Hello <0,255,255>World<r><hsl,0.1,1,0.5>!<r><r>"));
```

### Tasai API

While tasai's api might be similar to chalk at a glance, it does not support calling the color methods.
You are required to either compile the methods into functions or call the other helpers.

```ts
import { t } from "tasai";

const red = t.from8Bit(1).toFunction();
const blue = t.fromHex("#0000FF").toFunction();
const orange = t.fromColor(Color.fromHSL(0.1, 1, 0.5)).toFunction();
const italicUnderlineGreenBG = t.italic.underline.brightGreen.toFunction();

console.log(none("This is a really long test"));
console.log(red("This is a really long test"));
console.log(blue("This is a really long test"));
console.log(orange("This is a really long test"));
console.log(italicUnderlineGreenBG("This is a really long test"));
console.log(t.doubleUnderline.brightMagenta.colorize("This is a really long test"));
console.log(t.gradient("This is a really long test", Tasai.ICE_GRADIENT));
console.log(t.gradient("This is a really long test", Tasai.REVERSED_ICE_GRADIENT));
console.log(t.gradient("This is a really long test", Tasai.FIRE_GRADIENT));
console.log(t.gradient("This is a really long test", Tasai.REVERSED_FIRE_GRADIENT));
console.log(t.gradient("This is a really long test", Tasai.RAINBOW_GRADIENT));
console.log(t.inverse.gradient("This is a really long test", Tasai.RAINBOW_GRADIENT));
// Sets the gradient to be background but unlike `inverse` it doesn't swap the foreground color
console.log(t.gradient("This is a really long test", Tasai.RAINBOW_GRADIENT, true));
console.log(t.zebra("This is a really long test"));
console.log(t.bgBlue.zebra("This is a really long test"));
console.log(t.cyclic("This is a really long test", 2, [Color.AQUA, Color.PLUM]));
```