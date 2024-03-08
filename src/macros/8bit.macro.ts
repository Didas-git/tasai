import { getNormalizerWithBG } from "../colors/shared.js";
import { colorizeWith8Bit } from "../colors/8bit.js";

import {
    ForegroundColorMap,
    BackgroundColorMap,
    colorizeWith4Bit
} from "../colors/4bit.js";

import { deprecate } from "node:util";

export const parseUsing8BitColors = deprecate(function (string: string, isBackground: boolean = false): string {
    const opening = string.indexOf("<");
    if (opening === -1) return string;

    const closing = string.indexOf(">", opening);
    if (closing === -1) throw new Error("Incorrect syntax");

    const color = string.substring(opening + 1, closing).toLowerCase();
    const noColorPartBeginning = string.slice(0, opening);

    const afterColor = string.substring(closing + 1);
    if (!afterColor.length || afterColor === "<r>") return noColorPartBeginning;

    if (color === "r") return `${noColorPartBeginning}${getNormalizerWithBG(isBackground)}${parseUsing8BitColors(afterColor)}`;
    if (color.startsWith("#")) throw new Error("Hex colors are not supported when using 8bit colors");

    if (color.startsWith("bg")) {
        const parsedColor = color.replace("bg_", "");
        return `${noColorPartBeginning}${colorize(afterColor, parsedColor, true)}`;
    }

    return `${noColorPartBeginning}${colorize(afterColor, color)}`;
}, "parseUsing8BitColors() is deprecated. Use parse() instead. Optionally passing 'COLOR_SPACE=8bit' as an env var.");

function colorize(string: string, colorCodeOrName: string, isBackground: boolean = false): string {
    const colorCode = parseInt(colorCodeOrName);

    if (!Number.isNaN(colorCode)) return colorizeWith8Bit(parseUsing8BitColors(string, isBackground), colorCode);

    const code = isBackground ? BackgroundColorMap[colorCodeOrName] : ForegroundColorMap[colorCodeOrName];
    if (typeof code === "undefined") throw new Error(`Unknown color '${colorCodeOrName}'`);
    return colorizeWith4Bit(parseUsing8BitColors(string, isBackground), code);
}
