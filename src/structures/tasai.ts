/* eslint-disable @typescript-eslint/naming-convention */
import { colorizeWithGradient, colorizeWithGradientCyclicly, cycliclyColorize } from "../colors/24bit.js";
import { isValid8BitColor } from "../colors/8bit.js";
import { DirectGradient, Interpolation, JoinedGradient } from "./gradients.js";
import { Color, ColorSpace } from "./color.js";
import type { Gradient } from "./gradients.js";

export class Tasai {
    #openStack = new Set<string>();
    #closeStack = new Set<string>();

    #append(open: string | number, close: number): void {
        this.#openStack.add(open.toString());
        this.#closeStack.add(close.toString());
    }

    public toFunction(): (text: string) => string {
        const { open, close } = this.toParts();
        return (text: string): string => `${open}${text}${close}`;
    }

    public toParts(): { open: string, close: string } {
        if (this.#openStack.size === 0) return { open: "", close: "" };

        let open = "\x1B[";
        let close = "\x1B[";

        this.#openStack.forEach((val) => { open += `${val};`; });
        this.#closeStack.forEach((val) => { close += `${val};`; });

        open = `${open.substring(0, open.length - 1)}m`;
        close = `${close.substring(0, close.length - 1)}m`;

        this.#openStack = new Set();
        this.#closeStack = new Set();

        return { open, close };
    }

    public from8Bit(colorCode: number, isBackground: boolean = false): this {
        if (!isValid8BitColor(colorCode)) throw new Error("An invalid 8 bit color was given. Value should range from 0 to 255");
        this.#append(`${isBackground ? 48 : 38};5;${colorCode}`, isBackground ? 49 : 39);
        return this;
    }

    public fromHex(hex: string): this {
        return this.fromColor(Color.fromHex(hex));
    }

    public fromColor(color: Color, isBackground: boolean = false): this {
        this.#append(`${isBackground ? 48 : 38};2;${color.red8Bit};${color.green8Bit};${color.blue8Bit}`, isBackground ? 49 : 39);
        return this;
    }

    public colorize(text: string): string {
        const { open, close } = this.toParts();
        return `${open}${text}${close}`;
    }

    public cyclic(text: string, segments: number, colors: Array<Color>, isBackground: boolean = false): string {
        const { open, close } = this.toParts();
        return `${open}${cycliclyColorize(text, segments, colors, isBackground)}${close}`;
    }

    public gradient(text: string, gradient: Gradient, isBackground: boolean = false): string {
        const { open, close } = this.toParts();
        return `${open}${colorizeWithGradient(text, gradient, isBackground)}${close}`;
    }

    public cyclicGradient(text: string, segments: number, gradients: Array<Gradient>, isBackground: boolean = false): string {
        const { open, close } = this.toParts();
        return `${open}${colorizeWithGradientCyclicly(text, segments, gradients, isBackground)}${close}`;
    }

    //#region Foreground
    public get black(): this { this.#append(30, 39); return this; }
    public get red(): this { this.#append(31, 39); return this; }
    public get green(): this { this.#append(32, 39); return this; }
    public get yellow(): this { this.#append(33, 39); return this; }
    public get blue(): this { this.#append(34, 39); return this; }
    public get magenta(): this { this.#append(35, 39); return this; }
    public get cyan(): this { this.#append(36, 39); return this; }
    public get white(): this { this.#append(37, 39); return this; }
    public get brightBlack(): this { this.#append(90, 39); return this; }
    public get brightRed(): this { this.#append(91, 39); return this; }
    public get brightGreen(): this { this.#append(92, 39); return this; }
    public get brightYellow(): this { this.#append(93, 39); return this; }
    public get brightBlue(): this { this.#append(94, 39); return this; }
    public get brightMagenta(): this { this.#append(95, 39); return this; }
    public get brightCyan(): this { this.#append(96, 39); return this; }
    public get brightWhite(): this { this.#append(97, 39); return this; }
    //#endregion Foreground
    //#region Background
    public get bgBlack(): this { this.#append(40, 49); return this; }
    public get bgRed(): this { this.#append(41, 49); return this; }
    public get bgGreen(): this { this.#append(42, 49); return this; }
    public get bgYellow(): this { this.#append(43, 49); return this; }
    public get bgBlue(): this { this.#append(44, 49); return this; }
    public get bgMagenta(): this { this.#append(45, 49); return this; }
    public get bgCyan(): this { this.#append(46, 49); return this; }
    public get bgWhite(): this { this.#append(47, 49); return this; }
    public get bgBrightBlack(): this { this.#append(100, 49); return this; }
    public get bgBrightRed(): this { this.#append(101, 49); return this; }
    public get bgBrightGreen(): this { this.#append(102, 49); return this; }
    public get bgBrightYellow(): this { this.#append(103, 49); return this; }
    public get bgBrightBlue(): this { this.#append(104, 49); return this; }
    public get bgBrightMagenta(): this { this.#append(105, 49); return this; }
    public get bgBrightCyan(): this { this.#append(106, 49); return this; }
    public get bgBrightWhite(): this { this.#append(107, 49); return this; }
    //#endregion Background
    //#region Modifiers
    public get bold(): this { this.#append(1, 22); return this; }
    public get dim(): this { this.#append(2, 22); return this; }
    public get italic(): this { this.#append(3, 23); return this; }
    public get underline(): this { this.#append(4, 24); return this; }
    public get blink(): this { this.#append(5, 25); return this; }
    public get inverse(): this { this.#append(7, 27); return this; }
    public get hidden(): this { this.#append(8, 28); return this; }
    public get strikeThrough(): this { this.#append(9, 29); return this; }
    public get doubleUnderline(): this { this.#append(21, 24); return this; }
    public get overline(): this { this.#append(53, 55); return this; }
    //#region Modifiers
    //#region Presets
    public static readonly RAINBOW_GRADIENT = new DirectGradient(Color.RED, Color.RED, ColorSpace.HSV, Interpolation.LINEAR, true);
    public static readonly ICE_GRADIENT = new DirectGradient(
        Color.fromHex("#088fff"),
        Color.SILVER,
        ColorSpace.RGB,
        Interpolation.INCREMENTAL_QUADRATIC
    );

    public static readonly REVERSED_ICE_GRADIENT = new DirectGradient(
        Color.SILVER,
        Color.fromHex("#088fff"),
        ColorSpace.RGB,
        Interpolation.DECREMENTAL_QUADRATIC
    );

    public static readonly FIRE_GRADIENT = new JoinedGradient(
        Color.RED,
        [
            {
                color: Color.ORANGE,
                interpolation: Interpolation.INCREMENTAL_QUADRATIC,
                length: 2
            },
            {
                color: Color.YELLOW,
                space: ColorSpace.HSV
            }
        ]
    );

    public static readonly REVERSED_FIRE_GRADIENT = new JoinedGradient(
        Color.YELLOW,
        [
            {
                color: Color.ORANGE,
                interpolation: Interpolation.DECREMENTAL_QUADRATIC,
                length: 1
            },
            {
                color: Color.RED,
                space: ColorSpace.HSV
            }
        ]
    );

    public zebra(text: string): string {
        return this.cyclic(text, 1, [Color.WHITE, Color.BLACK]);
    }

    //#endregion
}
