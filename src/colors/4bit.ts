export const ForegroundColorMap: Record<string, number> = {
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37,
    bright_black: 90,
    bright_red: 91,
    bright_green: 92,
    bright_yellow: 93,
    bright_blue: 94,
    bright_magenta: 95,
    bright_cyan: 96,
    bright_white: 97
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
    bright_black: 100,
    bright_red: 101,
    bright_green: 102,
    bright_yellow: 103,
    bright_blue: 104,
    bright_magenta: 105,
    bright_cyan: 106,
    bright_white: 107
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
