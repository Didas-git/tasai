/* eslint-disable @stylistic/no-mixed-operators */
// The majority of this code was taken from colours.js (ISC License)
// https://github.com/ChasJC23/colours.js/blob/a715fd35721413acdca8d0eed1607c7ac3deb33e/src/mathExt.ts

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ExtendedMath {
    /** calculates the mid() of a set of values */
    public static mid(values: Array<number>): number {
        return (Math.max(...values) + Math.min(...values)) / 2;
    }

    /** calculates the means of a set of values */
    public static avg(values: Array<number>): number {
        return ExtendedMath.sum(values) / values.length;
    }

    /** calculates the sum of a set of values */
    public static sum(values: Array<number>): number {
        // We are optimizing for RGB sum
        let sum: number = (values[0] ?? 0) + (values[1] ?? 0) + (values[2] ?? 0);
        if (values.length <= 3) return sum;

        for (let i = 3, { length } = values; i < length; i++) sum += values[i];

        return sum;
    }

    /** linear interpolation */
    public static lerp(t: number, a: number, b: number): number {
        return (b - a) * t + a;
    }

    /** quadratic interpolation which starts at its turning point */
    public static qerp0(t: number, a: number, b: number): number {
        return (b - a) * t * t + a;
    }

    /** quadratic interpolation which ends at its turning point */
    public static qerp1(t: number, a: number, b: number): number {
        return (b - a) * (2 - t) * t + a;
    }

    /** cubic interpolation using derivatives */
    public static cubicInterpDeriv(t: number, a: number, b: number, aprime = 0, bprime = 0): number {
        return (2 * a - 2 * b + aprime + bprime) * t * t * t + (3 * b - 3 * a - 2 * aprime - bprime) * t * t + aprime * t + a;
    }

    /** cubic interpolation using points */
    public static cubicInterpPt(t: number, p0: number, p1: number, p2: number, p3: number): number {
        return (-0.5 * p0 + 1.5 * p1 - 1.5 * p2 + 0.5 * p3) * t * t * t + (p0 - 2.5 * p1 + 2 * p2 - 0.5 * p3) * t * t + (0.5 * p2 - 0.5 * p0) * t + p1;
    }

    /** cyclical linear interpolation using the shorter of the two immediate paths */
    public static cyclicLerpShort(t: number, a: number, b: number, cycles = 0): number {
        const diff = b - a;
        if (diff > 0.5)
            return ((diff - 1 - cycles) * t + a + 1 + cycles) % 1;

        else if (diff < -0.5)
            return ((diff + 1 + cycles) * t + a) % 1;

        else if (diff > 0)
            return ((diff + cycles) * t + a) % 1;

        return ((diff - cycles) * t + a + cycles) % 1;
    }

    /** cyclical linear interpolation using the longer of the two immediate paths */
    public static cyclicLerpLong(t: number, a: number, b: number, cycles = 0): number {
        const diff = b - a;
        if (diff > 0.5)
            return ((diff + cycles) * t + a) % 1;

        else if (diff < -0.5)
            return ((diff - cycles) * t + a + cycles) % 1;

        else if (diff > 0)
            return ((diff - 1 - cycles) * t + a + 1 + cycles) % 1;

        return ((diff + 1 + cycles) * t + a) % 1;
    }

    /** cyclical quadratic interpolation which starts at its turning point using the shorter of the two immediate paths */
    public static cyclicQerp0Short(t: number, a: number, b: number, cycles = 0): number {
        const diff = b - a;
        if (diff > 0.5)
            return ((diff - 1 - cycles) * t * t + a + 1 + cycles) % 1;

        else if (diff < -0.5)
            return ((diff + 1 + cycles) * t * t + a) % 1;

        else if (diff > 0)
            return ((diff + cycles) * t * t + a) % 1;

        return ((diff - cycles) * t * t + a + cycles) % 1;
    }

    /** cyclical quadratic interpolation which starts at its turning point using the longer of the two immediate paths */
    public static cyclicQerp0Long(t: number, a: number, b: number, cycles = 0): number {
        const diff = b - a;
        if (diff > 0.5)
            return ((diff + cycles) * t * t + a) % 1;

        else if (diff < -0.5)
            return ((diff - cycles) * t * t + a + cycles) % 1;

        else if (diff > 0)
            return ((diff - 1 - cycles) * t * t + a + 1 + cycles) % 1;

        return ((diff + 1 + cycles) * t * t + a) % 1;
    }

    /** cyclical quadratic interpolation which ends at its turning point using the shorter of the two immediate paths */
    public static cyclicQerp1Short(t: number, a: number, b: number, cycles = 0): number {
        const diff = b - a;
        if (diff > 0.5)
            return ((diff - 1 - cycles) * (2 - t) * t + a + 1 + cycles) % 1;

        else if (diff < -0.5)
            return ((diff + 1 + cycles) * (2 - t) * t + a) % 1;

        else if (diff > 0)
            return ((diff + cycles) * (2 - t) * t + a) % 1;

        return ((diff - cycles) * (2 - t) * t + a + cycles) % 1;
    }

    /** cyclical quadratic interpolation which ends at its turning point using the longer of the two immediate paths */
    public static cyclicQerp1Long(t: number, a: number, b: number, cycles = 0): number {
        const diff = b - a;
        if (diff > 0.5)
            return ((diff + cycles) * (2 - t) * t + a) % 1;

        else if (diff < -0.5)
            return ((diff - cycles) * (2 - t) * t + a + cycles) % 1;

        else if (diff > 0)
            return ((diff - 1 - cycles) * (2 - t) * t + a + 1 + cycles) % 1;

        return ((diff + 1 + cycles) * (2 - t) * t + a) % 1;
    }

    /** cyclical cubic interpolation using derivatives using the shorter of the two immediate paths */
    public static cyclicCubicInterpDerivShort(t: number, a: number, b: number, aprime = 0, bprime = 0, cycles = 0): number {
        const diff = b - a;
        if (diff > 0.5)
            return ((-2 * (diff - 1 - cycles) + aprime + bprime) * t * t * t + (3 * (diff - 1 - cycles) - 2 * aprime - bprime) * t * t + aprime * t + a + 1 + cycles) % 1;

        else if (diff < -0.5)
            return ((-2 * (diff + 1 + cycles) + aprime + bprime) * t * t * t + (3 * (diff + 1 + cycles) - 2 * aprime - bprime) * t * t + aprime * t + a) % 1;

        else if (diff > 0)
            return ((-2 * (diff + cycles) + aprime + bprime) * t * t * t + (3 * (diff + cycles) - 2 * aprime - bprime) * t * t + aprime * t + a) % 1;

        return ((-2 * (diff - cycles) + aprime + bprime) * t * t * t + (3 * (diff - cycles) - 2 * aprime - bprime) * t * t + aprime * t + a + cycles) % 1;
    }

    /** cyclical cubic interpolation using derivatives using the longer of the two immediate paths */
    public static cyclicCubicInterpDerivLong(t: number, a: number, b: number, aprime = 0, bprime = 0, cycles = 0): number {
        const diff = b - a;
        if (diff > 0.5)
            return ((-2 * (diff + cycles) + aprime + bprime) * t * t * t + (3 * (diff + cycles) - 2 * aprime - bprime) * t * t + aprime * t + a) % 1;

        else if (diff < -0.5)
            return ((-2 * (diff - cycles) + aprime + bprime) * t * t * t + (3 * (diff - cycles) - 2 * aprime - bprime) * t * t + aprime * t + a + cycles) % 1;

        else if (diff > 0)
            return ((-2 * (diff - 1 - cycles) + aprime + bprime) * t * t * t + (3 * (diff - 1 - cycles) - 2 * aprime - bprime) * t * t + aprime * t + a + 1 + cycles) % 1;

        return ((-2 * (diff + 1 + cycles) + aprime + bprime) * t * t * t + (3 * (diff + 1 + cycles) - 2 * aprime - bprime) * t * t + aprime * t + a) % 1;
    }

    /** ensures the sum of an array equals 1 */
    public static normalize1D(numbers: Array<number>): Array<number> {
        const total = ExtendedMath.sum(numbers);

        for (let i = 0, { length } = numbers; i < length; i++) numbers[i] /= total;

        return numbers;
    }
}
