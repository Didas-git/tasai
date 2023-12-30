import { getNormalizerWithBG } from "./shared.js";
import type { Color } from "../structures/color.js";

export function colorizeWith24Bit(string: string, color: Color, isBackground: boolean = false): string {
    return `\x1B[${isBackground ? 48 : 38};2;${color.red8Bit};${color.green8Bit};${color.blue8Bit}m${string}${getNormalizerWithBG(isBackground)}`;
}
