import { getNormalizerWithBG } from "./shared.js";

export function isValid8BitColor(code: number): boolean {
    return !Number.isNaN(code) && code >= 0 && code <= 255;
}

export function colorizeWith8Bit(string: string, code: number, isBackground: boolean = false): string {
    if (!isValid8BitColor(code)) throw new Error("An invalid 8 bit color was given. Value should range from 0 to 255");
    return `\x1B[${isBackground ? 48 : 38};5;${code}m${string}${getNormalizerWithBG(isBackground)}`;
}
