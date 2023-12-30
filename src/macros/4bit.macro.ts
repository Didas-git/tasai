import {
    get4BitColorNormalizer,
    ForegroundColorMap,
    BackgroundColorMap,
    colorizeWith4Bit
} from "../colors/4bit.js";

export function parseUsing4BitColors(string: string, currentColor?: number): string {
    const opening = string.indexOf("<");
    if (opening === -1) return string;

    const closing = string.indexOf(">", opening);
    if (closing === -1) throw new Error("Incorrect syntax");

    const color = string.substring(opening + 1, closing).toLowerCase();
    const noColorPartBeginning = string.slice(0, opening);

    const afterColor = string.substring(closing + 1);
    if (!afterColor.length || afterColor === "<r>") return noColorPartBeginning;

    if (color === "r") return `${noColorPartBeginning}${get4BitColorNormalizer(currentColor ?? 30)}${parseUsing4BitColors(afterColor)}`;
    if (color.startsWith("#")) throw new Error("Hex colors are not supported when using 4bit colors");

    if (color.startsWith("bg")) {
        const parsedColor = color.replace("bg_", "");
        const code = BackgroundColorMap[parsedColor];
        if (typeof code === "undefined") throw new Error(`Unknown color '${color}'`);
        return `${noColorPartBeginning}${colorizeWith4Bit(parseUsing4BitColors(afterColor, code), code)}`;
    }
    const code = ForegroundColorMap[color];
    if (typeof code === "undefined") throw new Error(`Unknown color '${color}'`);
    return `${noColorPartBeginning}${colorizeWith4Bit(parseUsing4BitColors(afterColor, code), code)}`;
}
