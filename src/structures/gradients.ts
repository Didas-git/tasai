// The majority of this code was taken from colours.js (ISC License)
// https://github.com/ChasJC23/colours.js/blob/a715fd35721413acdca8d0eed1607c7ac3deb33e/src/gradient.ts

import { ExtendedMath } from "../math.js";
import { ColorSpace, Color } from "./color.js";

type InterpolationFunction = (t: number, a: number, b: number) => number;
type CyclicInterpolationFunction = (t: number, a: number, b: number, cycles?: number) => number;
type ToColorFunction = (c1: number, c2: number, c3: number) => Color;
type FromColorFunction = (c: Color) => Array<number>;

/** the available interpolation methods supported by the library */
export enum Interpolation {
    LINEAR,
    INCREMENTAL_QUADRATIC,
    DECREMENTAL_QUADRATIC,
    CUBIC
}

interface CastingFunctions {
    fromColor: FromColorFunction;
    toColor: ToColorFunction;
}

interface InterpolationFunctions {
    interpolationFunction: InterpolationFunction;
    cyclicInterpolationFunction: CyclicInterpolationFunction;
}

/** any form of 1 dimensional gradient */
export interface Gradient {
    /** get the color at a specific point along the gradient, range [0, 1] */
    getAt: (t: number) => Color;
}

export class DirectGradient implements Gradient {
    public cycles: number;

    // start color in easy to interpolate form
    private s1: number;
    private s2: number;
    private s3: number;

    // end color in easy to interpolate form
    private e1: number;
    private e2: number;
    private e3: number;

    private cyclicArg: number;

    private fromColor: FromColorFunction;
    private toColor: ToColorFunction;

    private interpolationFunction: InterpolationFunction;
    private cyclicInterpolationFunction: CyclicInterpolationFunction;

    private colorSpace: ColorSpace;
    private interpolationMethod: Interpolation;

    #longRoute: boolean;

    /** represents a smooth gradient between two colors */
    public constructor(startColor: Color, endColor: Color, space = ColorSpace.RGB, interpolation = Interpolation.LINEAR, longRoute = false, cycles = 0) {
        this.colorSpace = space;
        this.interpolationMethod = interpolation;

        const { fromColor, toColor } = getCastingFunctions(space);
        const { interpolationFunction, cyclicInterpolationFunction } = getInterpolationFunctions(interpolation, longRoute);

        this.#longRoute = longRoute;

        this.toColor = toColor;
        this.fromColor = fromColor;

        this.interpolationFunction = interpolationFunction;
        this.cyclicInterpolationFunction = cyclicInterpolationFunction;

        [this.s1, this.s2, this.s3] = fromColor(startColor);
        [this.e1, this.e2, this.e3] = fromColor(endColor);

        this.cyclicArg = getCyclicArg(space);

        this.cycles = cycles;
    }

    public getAt(t: number): Color {
        return this.toColor(
            0b100 & this.cyclicArg ? this.cyclicInterpolationFunction(t, this.s1, this.e1, this.cycles) : this.interpolationFunction(t, this.s1, this.e1),
            0b010 & this.cyclicArg ? this.cyclicInterpolationFunction(t, this.s2, this.e2, this.cycles) : this.interpolationFunction(t, this.s2, this.e2),
            0b001 & this.cyclicArg ? this.cyclicInterpolationFunction(t, this.s3, this.e3, this.cycles) : this.interpolationFunction(t, this.s3, this.e3)
        );
    }

    public get startColor(): Color {
        return this.toColor(this.s1, this.s2, this.s3);
    }

    public set startColor(c: Color) {
        [this.s1, this.s2, this.s3] = this.fromColor(c);
    }

    public get endColor(): Color {
        return this.toColor(this.e1, this.e2, this.e3);
    }

    public set endColor(c: Color) {
        [this.e1, this.e2, this.e3] = this.fromColor(c);
    }

    public get interpolation(): Interpolation {
        return this.interpolationMethod;
    }

    public set interpolation(interpolation: Interpolation) {
        this.interpolationMethod = interpolation;
        const { interpolationFunction, cyclicInterpolationFunction } = getInterpolationFunctions(interpolation, this.#longRoute);
        this.interpolationFunction = interpolationFunction;
        this.cyclicInterpolationFunction = cyclicInterpolationFunction;
    }

    public get space(): ColorSpace {
        return this.colorSpace;
    }

    public set space(space: ColorSpace) {
        this.colorSpace = space;
        const s = this.startColor; const e = this.endColor;
        const { fromColor, toColor } = getCastingFunctions(space);
        this.fromColor = fromColor;
        this.toColor = toColor;
        this.cyclicArg = getCyclicArg(space);
        this.startColor = s;
        this.endColor = e;
    }

    public get longRoute(): boolean {
        return this.#longRoute;
    }

    public set longRoute(longRoute: boolean) {
        this.#longRoute = longRoute;
        const { interpolationFunction, cyclicInterpolationFunction } = getInterpolationFunctions(this.interpolationMethod, longRoute);
        this.interpolationFunction = interpolationFunction;
        this.cyclicInterpolationFunction = cyclicInterpolationFunction;
    }

    public toString(): string {
        return `DirectGradient(${this.startColor.toString()}, ${this.endColor.toString()})`;
    }
}

export class JoinedGradient implements Gradient {
    private colors: Array<Color>;
    private colorSpaces: Array<ColorSpace>;
    private interpolationMethods: Array<Interpolation>;
    private lengths: Array<number>;
    private longRoutes: Array<boolean>;
    private cycles: Array<number>;
    private factor: number;

    /** represents a gradient between many colors, traveling an abstract route through color space. */
    public constructor(startColor: Color, segments: Array<GradientSegment>) {
        this.colors = [startColor];
        this.colorSpaces = [];
        this.interpolationMethods = [];
        this.longRoutes = [];
        this.cycles = [];
        const lengths = [];

        for (let i = 0, { length } = segments; i < length; i++) {
            const segment = segments[i];
            if (typeof segment.color === "undefined") throw new Error("A color must be specified in all segments.");

            this.colors.push(segment.color);
            this.colorSpaces.push(segment.space ?? ColorSpace.RGB);
            this.interpolationMethods.push(segment.interpolation ?? Interpolation.LINEAR);
            this.longRoutes.push(segment.longRoute ?? false);
            this.cycles.push(segment.cycles ?? 0);
            lengths.push(segment.length ?? 1);
        }

        this.factor = ExtendedMath.sum(lengths);

        this.lengths = ExtendedMath.normalize1D(lengths);
    }

    public getAt(t: number): Color {
        let lt = t;
        let i = 0;
        for (; lt > this.lengths[i]; i++) lt -= this.lengths[i];
        lt /= this.lengths[i];
        const g = new DirectGradient(this.colors[i], this.colors[i + 1], this.colorSpaces[i], this.interpolationMethods[i], this.longRoutes[i], this.cycles[i]);
        return g.getAt(lt);
    }

    /** get the contained gradient at index i */
    public getGradient(i: number): DirectGradient {
        return new DirectGradient(this.colors[i], this.colors[i + 1], this.colorSpaces[i], this.interpolationMethods[i], this.longRoutes[i], this.cycles[i]);
    }

    /** set the contained gradient at index i */
    public setGradient(i: number, gradient: DirectGradient): void {
        this.colors[i] = gradient.startColor;
        this.colors[i + 1] = gradient.endColor;
        this.colorSpaces[i] = gradient.space;
        this.interpolationMethods[i] = gradient.interpolation;
        this.longRoutes[i] = gradient.longRoute;
        this.cycles[i] = gradient.cycles;
    }

    /** get the length of the contained gradient at index i */
    public getGradientLength(i: number): number {
        return this.lengths[i] * this.factor;
    }

    /** set the length of the contained gradient at index i */
    public setGradientLength(i: number, length: number): void {
        const originalLengths = this.lengths;

        for (let j = 0, { length: len } = originalLengths; j < len; j++) originalLengths[i] *= this.factor;

        originalLengths[i] = length;
        this.factor = ExtendedMath.sum(originalLengths);
        this.lengths = ExtendedMath.normalize1D(originalLengths);
    }

    public toString(): string {
        return `JoinedGradient(${this.colors[0].toString()}, ${this.colors[this.colors.length - 1].toString()})`;
    }
}

/** used for segmented gradients */
export interface GradientSegment {
    color?: Color;
    length?: number;
    space?: ColorSpace;
    interpolation?: Interpolation;
    longRoute?: boolean;
    cycles?: number;
}

/** collects the appropriate casting functions for a given color space */
function getCastingFunctions(space: ColorSpace): CastingFunctions {
    let fromColor: FromColorFunction;
    let toColor: ToColorFunction;

    switch (space) {
        case ColorSpace.RGB:
            fromColor = (c) => c.toRGB();
            toColor = (r, g, b) => new Color(r, g, b);
            break;
        case ColorSpace.HSV:
            fromColor = (c) => c.toHSV();
            toColor = (h, s, v) => Color.fromHSV(h, s, v);
            break;
        case ColorSpace.HSL:
            fromColor = (c) => c.toHSL();
            toColor = (h, s, l) => Color.fromHSL(h, s, l);
            break;
        case ColorSpace.HSI:
            fromColor = (c) => c.toHSI();
            toColor = (h, s, i) => Color.fromHSI(h, s, i);
            break;
        default:
            throw new Error("That color space is not yet supported within in this function.");
    }

    return { toColor: toColor, fromColor: fromColor };
}

/** collects the appropriate interpolation functions for a given interpolation method */
function getInterpolationFunctions(interpolation: Interpolation, longRoute = false): InterpolationFunctions {
    let interpFtn: InterpolationFunction;
    let cyclicInterpFtn: CyclicInterpolationFunction;

    switch (interpolation) {
        case Interpolation.LINEAR:
            interpFtn = ExtendedMath.lerp;
            cyclicInterpFtn = longRoute ? ExtendedMath.cyclicLerpLong : ExtendedMath.cyclicLerpShort;
            break;
        case Interpolation.INCREMENTAL_QUADRATIC:
            interpFtn = ExtendedMath.qerp0;
            cyclicInterpFtn = longRoute ? ExtendedMath.cyclicQerp0Long : ExtendedMath.cyclicQerp0Short;
            break;
        case Interpolation.DECREMENTAL_QUADRATIC:
            interpFtn = ExtendedMath.qerp1;
            cyclicInterpFtn = longRoute ? ExtendedMath.cyclicQerp1Long : ExtendedMath.cyclicQerp1Short;
            break;
        case Interpolation.CUBIC:
            interpFtn = ExtendedMath.cubicInterpDeriv;
            cyclicInterpFtn = longRoute
                ? (t, a, b, cycles) => ExtendedMath.cyclicCubicInterpDerivLong(t, a, b, 0, 0, cycles)
                : (t, a, b, cycles) => ExtendedMath.cyclicCubicInterpDerivShort(t, a, b, 0, 0, cycles);
            break;
        default:
            throw new Error("That interpolation method is not yet supported within this function");
    }

    return { interpolationFunction: interpFtn, cyclicInterpolationFunction: cyclicInterpFtn };
}

/** returns a number which indicates which components of a given color system are cyclical */
function getCyclicArg(space: ColorSpace): number {
    return space === ColorSpace.RGB ? 0 : 0b100;
}
