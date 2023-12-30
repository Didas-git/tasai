/* eslint-disable @stylistic/no-mixed-operators */
// The majority of this code was taken from colours.js (ISC License)
// https://github.com/ChasJC23/colours.js/blob/a715fd35721413acdca8d0eed1607c7ac3deb33e/src/colour.ts

import { ExtendedMath } from "../math.js";

export enum ColorSpace {
    RGB,
    HSV,
    HSL,
    HSI
}

export class Color {
    #r: number;
    #g: number;
    #b: number;
    #a: number;

    /** class representing a digital presentable color */
    public constructor(r: number | bigint, g: number | bigint, b: number | bigint, a: number | bigint = 1) {
        this.#r = typeof r === "number" ? Math.min(Math.max(r, 0), 1) : Number(r) / 255;
        this.#g = typeof g === "number" ? Math.min(Math.max(g, 0), 1) : Number(g) / 255;
        this.#b = typeof b === "number" ? Math.min(Math.max(b, 0), 1) : Number(b) / 255;
        this.#a = typeof a === "number" ? Math.min(Math.max(a, 0), 1) : Number(a) / 255;
    }

    /** export this color into RGB format */
    public toRGB(): [r: number, g: number, b: number] {
        return [this.#r, this.#g, this.#b];
    }

    /** export this color into RGBA format */
    public toRGBA(): [r: number, g: number, b: number, a: number] {
        return [this.#r, this.#g, this.#b, this.#a];
    }

    /** export this color into 24-bit RGB */
    public to24BitRGB(): [r: number, g: number, b: number] {
        return [this.red8Bit, this.green8Bit, this.blue8Bit];
    }

    /** export this color into 32-bit RGBA */
    public to32BitRGBA(): [r: number, g: number, b: number, a: number] {
        return [this.red8Bit, this.green8Bit, this.blue8Bit, this.alpha8Bit];
    }

    /** export this color into HSV format */
    public toHSV(): [h: number, s: number, v: number] {
        return [this.hue, this.saturationHSV, this.value];
    }

    /** export this color into HSL format */
    public toHSL(): [h: number, s: number, l: number] {
        return [this.hue, this.saturationHSL, this.lightness];
    }

    /** export this color into HSI format */
    public toHSI(): [h: number, s: number, i: number] {
        return [this.hue, this.saturationHSI, this.intensity];
    }

    public toString(): string {
        return `Color(r: ${this.red}, g: ${this.green}, b: ${this.blue})`;
    }

    /** the red component of this color in RGB format */
    public get red(): number {
        return this.#r;
    }

    public set red(r: number) {
        this.#r = Math.min(Math.max(r, 0), 1);
    }

    /** the green component of this color in RGB format */
    public get green(): number {
        return this.#g;
    }

    public set green(g: number) {
        this.#g = Math.min(Math.max(g, 0), 1);
    }

    /** the blue component of this color in RGB format */
    public get blue(): number {
        return this.#b;
    }

    public set blue(b: number) {
        this.#b = Math.min(Math.max(b, 0), 1);
    }

    /** the alpha channel of this color */
    public get alpha(): number {
        return this.#a;
    }

    public set alpha(a: number) {
        this.#a = Math.min(Math.max(a, 0), 1);
    }

    public get red8Bit(): number { return Math.round(this.#r * 0xFF); }
    public get green8Bit(): number { return Math.round(this.#g * 0xFF); }
    public get blue8Bit(): number { return Math.round(this.#b * 0xFF); }
    public get alpha8Bit(): number { return Math.round(this.#a * 0xFF); }

    /** the chroma of this color */
    public get chroma(): number {
        return Math.max(this.#r, this.#g, this.#b) - Math.min(this.#r, this.#g, this.#b);
    }

    public set chroma(c: number) {
        if (c < 0) c = 0;
        const i = this.intensity;
        const oc = this.chroma;
        this.#r = (this.#r - i) * c / oc + i;
        this.#g = (this.#g - i) * c / oc + i;
        this.#b = (this.#b - i) * c / oc + i;
    }

    /** the hue of this color */
    public get hue(): number {
        if (this.chroma === 0) return 0;
        let huePrime: number;
        switch (Math.max(this.#r, this.#g, this.#b)) {
            case this.#r:
                huePrime = ((this.#g - this.#b) / this.chroma + 6) % 6;
                break;
            case this.#g:
                huePrime = (this.#b - this.#r) / this.chroma + 2;
                break;
            case this.#b:
                huePrime = (this.#r - this.#g) / this.chroma + 4;
                break;
            default:
                huePrime = 0;
                break;
        }
        return huePrime / 6;
    }

    public set hue(h: number) {
        const replacements = Color.fromHSV(h, this.saturationHSV, this.value);
        this.#r = replacements.red;
        this.#g = replacements.green;
        this.#b = replacements.blue;
    }

    /** the brightness of this color in HSI format */
    public get intensity(): number {
        return ExtendedMath.avg([this.#r, this.#g, this.#b]);
    }

    public set intensity(i: number) {
        const replacements = Color.fromHSI(this.hue, this.saturationHSI, i);
        this.#r = replacements.red;
        this.#g = replacements.green;
        this.#b = replacements.blue;
    }

    /** the brightness of this color in HSV format */
    public get value(): number {
        return Math.max(this.#r, this.#g, this.#b);
    }

    public set value(v: number) {
        const replacements = Color.fromHSV(this.hue, this.saturationHSV, v);
        this.#r = replacements.red;
        this.#g = replacements.green;
        this.#b = replacements.blue;
    }

    /** the brightness of this color in HSL format */
    public get lightness(): number {
        return ExtendedMath.mid([this.#r, this.#g, this.#b]);
    }

    public set lightness(l: number) {
        const replacements = Color.fromHSL(this.hue, this.saturationHSL, l);
        this.#r = replacements.red;
        this.#g = replacements.green;
        this.#b = replacements.blue;
    }

    /** the saturation of this color in HSV format */
    public get saturationHSV(): number {
        return this.value === 0 ? 0 : this.chroma / this.value;
    }

    public set saturationHSV(s: number) {
        const replacements = Color.fromHSV(this.hue, s, this.value);
        this.#r = replacements.red;
        this.#g = replacements.green;
        this.#b = replacements.blue;
    }

    /** the saturation of this color in HSL format */
    public get saturationHSL(): number {
        return this.lightness % 1 === 0 ? 0 : this.chroma / (1 - Math.abs(2 * this.lightness - 1));
    }

    public set saturationHSL(s: number) {
        const replacements = Color.fromHSL(this.hue, s, this.lightness);
        this.#r = replacements.red;
        this.#g = replacements.green;
        this.#b = replacements.blue;
    }

    /** the saturation of this color in HSI format */
    public get saturationHSI(): number {
        return this.intensity === 0 ? 0 : 1 - Math.min(this.#r, this.#g, this.#b) / this.intensity;
    }

    public set saturationHSI(s: number) {
        const replacements = Color.fromHSI(this.hue, s, this.intensity);
        this.#r = replacements.red;
        this.#g = replacements.green;
        this.#b = replacements.blue;
    }

    /** create a color from a corresponding hex value */
    public static fromHex(hex: string): Color {
        // remove any leading formatting characters
        hex = hex.replace("#", "").replace("0x", "");

        const colorValue = Number.parseInt(hex, 16);

        let r: number;
        let g: number;
        let b: number;

        switch (hex.length) {
            // 8-bit color
            case 2:
                r = (colorValue & 0b1110_0000) / 0b1110_0000;
                g = (colorValue & 0b0001_1100) / 0b0001_1100;
                b = (colorValue & 0b0000_0011) / 0b0000_0011;
                break;

            // 12-bit color
            case 3:
                r = (colorValue & 0xF00) / 0xF00;
                g = (colorValue & 0x0F0) / 0x0F0;
                b = (colorValue & 0x00F) / 0x00F;
                break;

            // 16-bit color
            case 4:
                r = (colorValue & 0xF800) / 0xF800;
                g = (colorValue & 0x07E0) / 0x07E0;
                b = (colorValue & 0x001F) / 0x001F;
                break;

            // 24-bit color
            case 6:
                r = (colorValue & 0xFF_00_00) / 0xFF_00_00;
                g = (colorValue & 0x00_FF_00) / 0x00_FF_00;
                b = (colorValue & 0x00_00_FF) / 0x00_00_FF;
                break;

            // 36-bit color
            case 9:
                r = (colorValue & 0xFFF_000_000) / 0xFFF_000_000;
                g = (colorValue & 0x000_FFF_000) / 0x000_FFF_000;
                b = (colorValue & 0x000_000_FFF) / 0x000_000_FFF;
                break;

            // 48-bit color
            case 12:
                r = (colorValue & 0xFFFF_0000_0000) / 0xFFFF_0000_0000;
                g = (colorValue & 0x0000_FFFF_0000) / 0x0000_FFFF_0000;
                b = (colorValue & 0x0000_0000_FFFF) / 0x0000_0000_FFFF;
                break;

            default:
                throw new Error("Invalid color format");
        }

        return new Color(r, g, b);
    }

    /** create a color from HSV format */
    public static fromHSV(hue: number, saturation: number, value: number, alpha = 1): Color {
        const chroma = value * saturation;
        const scaledHue = hue * 6;

        // integer to isolate the 6 separate cases for hue
        const hueRegion = Math.floor(scaledHue);

        // intermediate value for second largest component
        const X = chroma * (1 - Math.abs(scaledHue % 2 - 1));

        // constant to add to all color components
        const m = value - chroma;

        return Color.fromCXM(hueRegion, chroma, X, m, alpha);
    }

    /** create a color from HSL format */
    public static fromHSL(hue: number, saturation: number, lightness: number, alpha = 1): Color {
        const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
        const scaledHue = hue * 6;

        // integer to isolate the 6 separate cases for hue
        const hueRegion = Math.floor(scaledHue);

        // intermediate value for second largest component
        const X = chroma * (1 - Math.abs(scaledHue % 2 - 1));

        // constant to add to all color components
        const m = lightness - chroma * 0.5;

        return Color.fromCXM(hueRegion, chroma, X, m, alpha);
    }

    /** create a color from HSI format */
    public static fromHSI(hue: number, saturation: number, intensity: number, alpha = 1): Color {
        const scaledHue = hue * 6;

        // integer to isolate the 6 separate cases for hue
        const hueRegion = Math.floor(scaledHue);

        const Z = 1 - Math.abs(scaledHue % 2 - 1);

        const chroma = 3 * intensity * saturation / (1 + Z);

        // intermediate value for second largest component
        const X = chroma * Z;

        // constant to add to all color components
        const m = intensity * (1 - saturation);

        return Color.fromCXM(hueRegion, chroma, X, m, alpha);
    }

    /** create a color from 24-bit RGB format */
    public static from24BitRGB(r: number, g: number, b: number): Color {
        return this.from32BitRGBA(r, g, b);
    }

    /** create a color from 32-bit RGBA format */
    public static from32BitRGBA(r: number, g: number, b: number, a?: number): Color {
        return new Color(r / 0xFF, g / 0xFF, b / 0xFF, a ? a / 0xFF : 1);
    }

    private static fromCXM(hueRegion: number, chroma: number, X: number, m: number, alpha: number): Color {
        switch (hueRegion) {
            case 0: // red to yellow
                return new Color(chroma + m, X + m, m, alpha);
            case 1: // yellow to green
                return new Color(X + m, chroma + m, m, alpha);
            case 2: // green to cyan
                return new Color(m, chroma + m, X + m, alpha);
            case 3: // cyan to blue
                return new Color(m, X + m, chroma + m, alpha);
            case 4: // blue to magenta
                return new Color(X + m, m, chroma + m, alpha);
            case 5: // magenta to red
                return new Color(chroma + m, m, X + m, alpha);
            default:
                return Color.fromHex("#000000");
        }
    }
}
