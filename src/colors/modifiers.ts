export const ModifiersMap: Record<string, [opening: number, closing: number]> = {
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    blink: [5, 25],
    inverse: [7, 27],
    hidden: [8, 28],
    strikeThrough: [9, 29],
    doubleUnderline: [21, 24],
    overline: [53, 55]
};
