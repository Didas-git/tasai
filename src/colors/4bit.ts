export const ForegroundColorMap: Record<string, number> = {
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37,
    brightBlack: 90,
    brightRed: 91,
    brightGreen: 92,
    brightYellow: 93,
    brightBlue: 94,
    brightMagenta: 95,
    brightCyan: 96,
    brightWhite: 97
};

export const BackgroundColorMap: Record<string, number> = {
    black: 40,
    red: 41,
    green: 42,
    yellow: 43,
    blue: 44,
    magenta: 45,
    cyan: 46,
    white: 47,
    brightBlack: 100,
    brightRed: 101,
    brightGreen: 102,
    brightYellow: 103,
    brightBlue: 104,
    brightMagenta: 105,
    brightCyan: 106,
    brightWhite: 107
};

function isBackgroundColor(code: number): boolean {
    return code >= 40 && code <= 47;
}

export function get4BitColorNormalizer(code: number): string {
    return `\x1B[${isBackgroundColor(code) ? 49 : 39}m`;
}

export function colorizeWith4Bit(string: string, code: number): string {
    return `\x1B[${code}m${string}${get4BitColorNormalizer(code)}`;
}
