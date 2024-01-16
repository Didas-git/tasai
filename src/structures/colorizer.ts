/* eslint-disable @typescript-eslint/unbound-method */

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface Colorizer {
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    (string: string): string;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class Colorizer {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly RESET = "\x1B[0m";

    protected colorize(open: number, close: number): Colorizer {
        function style(this: { stack?: Array<Array<number>> }, input: string): string {
            if (input.includes(close.toString())) input = input.replace(new RegExp(`\\u001b\\[${close}m`, "g"), `\x1B[${close}m\x1B[${open}m`);
            if (typeof this.stack === "undefined") return `\x1B[${open}m${input}\x1B[${close}m`;

            let openStack = "";
            let closeStack = "";
            for (let i = 0, { length } = this.stack; i < length; i++) {
                const [o, c] = this.stack[i];

                if (input.includes(c.toString())) input = input.replace(new RegExp(`\\x1B\\[${c}m`, "g"), `\x1B[${c}m\x1B[${o}m`);

                openStack += `\x1B[${o}m`;
                closeStack += `\x1B[${c}m`;
            }

            openStack += `\x1B[${open}m`;
            closeStack += `\x1B[${close}m`;
            return `${openStack}${input}${closeStack}`;
        }

        Object.setPrototypeOf(style, this);

        //@ts-expect-error Its not being used, its being checked
        if (typeof style.stack === "undefined") style.stack = [[open, close]];
        else style.stack.push([open, close]);

        return style as never;
    }

    //#region Foreground
    public get black(): Colorizer { return this.colorize(30, 39); }
    public get red(): Colorizer { return this.colorize(31, 39); }
    public get green(): Colorizer { return this.colorize(32, 39); }
    public get yellow(): Colorizer { return this.colorize(33, 39); }
    public get blue(): Colorizer { return this.colorize(34, 39); }
    public get magenta(): Colorizer { return this.colorize(35, 39); }
    public get cyan(): Colorizer { return this.colorize(36, 39); }
    public get white(): Colorizer { return this.colorize(37, 39); }
    public get brightBlack(): Colorizer { return this.colorize(90, 39); }
    public get brightRed(): Colorizer { return this.colorize(91, 39); }
    public get brightGreen(): Colorizer { return this.colorize(92, 39); }
    public get brightYellow(): Colorizer { return this.colorize(93, 39); }
    public get brightBlue(): Colorizer { return this.colorize(94, 39); }
    public get brightMagenta(): Colorizer { return this.colorize(95, 39); }
    public get brightCyan(): Colorizer { return this.colorize(96, 39); }
    public get brightWhite(): Colorizer { return this.colorize(97, 39); }

    //#endregion Foreground
    //#region Background
    public get bgBlack(): Colorizer { return this.colorize(40, 49); }
    public get bgRed(): Colorizer { return this.colorize(41, 49); }
    public get bgGreen(): Colorizer { return this.colorize(42, 49); }
    public get bgYellow(): Colorizer { return this.colorize(43, 49); }
    public get bgBlue(): Colorizer { return this.colorize(44, 49); }
    public get bgMagenta(): Colorizer { return this.colorize(45, 49); }
    public get bgCyan(): Colorizer { return this.colorize(46, 49); }
    public get bgWhite(): Colorizer { return this.colorize(47, 49); }
    public get bgBrightBlack(): Colorizer { return this.colorize(100, 49); }
    public get bgBrightRed(): Colorizer { return this.colorize(101, 49); }
    public get bgBrightGreen(): Colorizer { return this.colorize(102, 49); }
    public get bgBrightYellow(): Colorizer { return this.colorize(103, 49); }
    public get bgBrightBlue(): Colorizer { return this.colorize(104, 49); }
    public get bgBrightMagenta(): Colorizer { return this.colorize(105, 49); }
    public get bgBrightCyan(): Colorizer { return this.colorize(106, 49); }
    public get bgBrightWhite(): Colorizer { return this.colorize(107, 49); }
    //#endregion Background
    //#region Modifiers
    public get bold(): Colorizer { return this.colorize(1, 22); }
    public get dim(): Colorizer { return this.colorize(2, 22); }
    public get italic(): Colorizer { return this.colorize(3, 23); }
    public get underline(): Colorizer { return this.colorize(4, 24); }
    public get blink(): Colorizer { return this.colorize(5, 25); }
    public get inverse(): Colorizer { return this.colorize(7, 27); }
    public get hidden(): Colorizer { return this.colorize(8, 28); }
    public get strikeThrough(): Colorizer { return this.colorize(9, 29); }
    public get doubleUnderline(): Colorizer { return this.colorize(21, 24); }
    public get overline(): Colorizer { return this.colorize(53, 55); }
    //#region Modifiers
}
