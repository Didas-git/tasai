import { getNormalizerWithBG } from "./shared.js";
import type { Gradient } from "../structures/gradients.js";
import type { Color } from "../structures/color.js";

function getColorableCount(text: string): number {
    let colorableCount = 0;

    for (let i = 0; i < text.length; i++) {
        if (text[i] === "\x1B") {
            do i++; while (text[i] !== "m");
            i++;
        }
        colorableCount++;
    }

    return colorableCount;
}

export function cycliclyColorize(text: string, segmentLength: number, colors: Array<Color>, isBackground: boolean = false): string {
    const initToken = isBackground ? 48 : 38;

    let result = "";
    let c = 0;

    for (let i = 0, { length } = text; i < length; i++) {
        if (text[i] === "\u001B") {
            do {
                result += text[i];
                i++;
            } while (text[i] !== "m");
            result += text[i];
            i++;
        }

        const color = colors[Math.floor(c / segmentLength) % colors.length];
        result += `\x1B[${initToken};2;${color.red8Bit};${color.green8Bit};${color.blue8Bit}m${text[i]}`;

        c++;
    }
    return `${result}\x1B[${isBackground ? 49 : 39}m`;
}

export function colorizeWithGradient(text: string, gradient: Gradient, isBackground = false): string {
    const colorableCount = getColorableCount(text);
    const initToken = isBackground ? 48 : 38;
    let result = "";
    let t = 0;

    for (let i = 0, { length } = text; i < length; i++) {
        if (text[i] === "\u001B") {
            do {
                result += text[i];
                i++;
            } while (text[i] !== "m");
            result += text[i];
            i++;
        }

        const color = gradient.getAt(t / colorableCount);
        result += `\x1B[${initToken};2;${color.red8Bit};${color.green8Bit};${color.blue8Bit}m${text[i]}`;

        t++;
    }

    return `${result}\x1B[${isBackground ? 49 : 39}m`;
}

export function colorizeWithGradientCyclicly(text: string, segmentLength: number, gradients: Array<Gradient>, isBackground: boolean = false): string {
    const initToken = isBackground ? 48 : 38;

    let result = "";
    let c = 0;

    for (let i = 0; i < text.length; i++) {
        if (text[i] === "\u001B") {
            do {
                result += text[i];
                i++;
            } while (text[i] !== "m");
            result += text[i];
            i++;
        }

        const prop = c / segmentLength;
        const index = Math.floor(prop) % gradients.length;
        const t = prop % 1;

        const color = gradients[index].getAt(t);

        result += `\x1B[${initToken};2;${color.red8Bit};${color.green8Bit};${color.blue8Bit}m${text[i]}`;

        c++;
    }

    return `${result}\x1B[${isBackground ? 49 : 39}m`;
}

export function colorizeWith24Bit(string: string, color: Color, isBackground: boolean = false): string {
    return `\x1B[${isBackground ? 48 : 38};2;${color.red8Bit};${color.green8Bit};${color.blue8Bit}m${string}${getNormalizerWithBG(isBackground)}`;
}
