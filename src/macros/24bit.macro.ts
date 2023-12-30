import { getNormalizerWithBG } from "../colors/shared.js";
import { colorizeWith24Bit } from "../colors/24bit.js";
import { colorizeWith8Bit } from "../colors/8bit.js";
import { Color } from "../structures/color.js";

import {
    ForegroundColorMap,
    BackgroundColorMap,
    colorizeWith4Bit
} from "../colors/4bit.js";

export function parseUsing24BitColors(string: string, isBackground: boolean = false): string {
    const opening = string.indexOf("<");
    if (opening === -1) return string;

    const closing = string.indexOf(">", opening);
    if (closing === -1) throw new Error("Incorrect syntax");

    const color = string.substring(opening + 1, closing).toLowerCase();
    const noColorPartBeginning = string.slice(0, opening);

    const afterColor = string.substring(closing + 1);
    if (!afterColor.length || afterColor === "<r>") return noColorPartBeginning;

    if (color === "r") return `${noColorPartBeginning}${getNormalizerWithBG(isBackground)}${parseUsing24BitColors(afterColor)}`;

    if (color.startsWith("bg")) {
        const parsedColor = color.replace("bg_", "");
        return `${noColorPartBeginning}${colorize(afterColor, parsedColor, true)}`;
    }

    return `${noColorPartBeginning}${colorize(afterColor, color)}`;
}

const ColorSpaceMap: Record<string, string> = {
    RGB: "from24BitRGB",
    HSV: "fromHSV",
    HSL: "fromHSL",
    HSI: "fromHSI"
};

function colorize(string: string, colorCodeOrName: string, isBackground: boolean = false): string {
    const colorCode = parseInt(colorCodeOrName);

    // Handle 8Bit
    if (!Number.isNaN(colorCode)) return colorizeWith8Bit(parseUsing24BitColors(string, isBackground), colorCode, isBackground);

    // Handle hex as 24Bit
    if (colorCodeOrName.startsWith("#")) return colorizeWith24Bit(parseUsing24BitColors(string, isBackground), Color.fromHex(colorCodeOrName), isBackground);

    // Are we in 4Bit or comma separated list?
    const code = isBackground ? BackgroundColorMap[colorCodeOrName] : ForegroundColorMap[colorCodeOrName];

    // Handle 4Bit
    if (typeof code !== "undefined") return colorizeWith4Bit(parseUsing24BitColors(string, isBackground), code);

    // Handle 24Bit
    const list = colorCodeOrName.split(",");
    switch (list.length) {
        case 3: {
            const [r, g, b] = list;
            const rInt = parseFloat(r);
            const gInt = parseFloat(g);
            const bInt = parseFloat(b);

            if (Number.isNaN(rInt) || Number.isNaN(bInt) || Number.isNaN(gInt)) throw new Error("NaN found inside the list");
            return colorizeWith24Bit(parseUsing24BitColors(string, isBackground), new Color(rInt, gInt, bInt), isBackground);
        }
        case 4: {
            const [space, r, g, b] = list;

            const colorSpaceFn = ColorSpaceMap[space.toUpperCase()];
            if (typeof colorSpaceFn === "undefined") throw new Error("Invalid ColorSpace");

            const rInt = parseFloat(r);
            const gInt = parseFloat(g);
            const bInt = parseFloat(b);

            if (Number.isNaN(rInt) || Number.isNaN(bInt) || Number.isNaN(gInt)) throw new Error("NaN found inside the list");

            // eslint-disable-next-line @typescript-eslint/ban-types
            return colorizeWith24Bit(parseUsing24BitColors(string, isBackground), (<Function>Color[colorSpaceFn as never])(rInt, gInt, bInt) as Color, isBackground);
        }
        default:
            throw new Error("Invalid 24Bit list");
    }
}
