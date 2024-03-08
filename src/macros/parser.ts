import { ModifiersMap } from "../colors/modifiers.js";
import { BackgroundColorMap, Color, ForegroundColorMap } from "../index.js";

export type MacroColorSpace = "4bit" | "8bit" | "24bit";

const ColorSpaceMap: Record<string, string> = {
    RGB: "from24BitRGB",
    HSV: "fromHSV",
    HSL: "fromHSL",
    HSI: "fromHSI"
};

export class StringParser {
    readonly #closeChar: string;
    readonly #colorSpace: MacroColorSpace;
    readonly #bgToken: string;
    readonly #skipTagParsingErrors: boolean;

    public constructor(
        colorSpace: MacroColorSpace = "24bit",
        closeChar: string = "r",
        backgroundToken: string = "bg_",
        skipErrors: boolean = false
    ) {
        this.#closeChar = closeChar;
        this.#colorSpace = colorSpace;
        this.#bgToken = backgroundToken;
        this.#skipTagParsingErrors = skipErrors;
    }

    public parse(string: string): string {
        if (!string.includes("<")) return string;

        const stringStack: Array<string> = [];
        const codeStack: Array<number> = [];

        for (let i = 0, { length } = string; i < length; i++) {
            if (string[i] === "<") {
                const closing = string.indexOf(">", i + 1);
                if (closing === -1) throw new Error("Invalid syntax");

                const tag = string.substring(i + 1, closing);
                const code = this.#parseTag(tag, codeStack);
                if (code !== null) stringStack.push(`\x1B[${code}m`);

                i = closing;
                continue;
            }

            stringStack.push(string[i]);
        }

        return this.#mergeCodes(stringStack).join("");
    }

    #parseTag(tag: string, codeStack: Array<number>): number | string | null {
        if (tag === this.#closeChar) {
            const code = codeStack.pop();
            if (typeof code === "undefined") {
                if (this.#skipTagParsingErrors) {
                    codeStack.pop();
                    return null;
                }

                throw new Error("Encountered extra closing tag");
            }

            return code;
        }

        const modifier = ModifiersMap[tag];
        if (typeof modifier !== "undefined") {
            codeStack.push(modifier[1]);
            return modifier[0];
        }

        const isBackground = tag.startsWith(this.#bgToken);
        codeStack.push(isBackground ? 49 : 39);
        tag = tag.replace(this.#bgToken, "");

        const color = isBackground ? BackgroundColorMap[tag] : ForegroundColorMap[tag];
        if (typeof color !== "undefined") return color;
        if (this.#colorSpace === "4bit") {
            if (this.#skipTagParsingErrors) {
                codeStack.pop();
                return null;
            }

            throw new Error("Color is outside of the color space (4bit)");
        }

        const colorNumber = parseInt(tag);
        if (!Number.isNaN(colorNumber)) return `${isBackground ? 48 : 38};5;${colorNumber}`;
        if (this.#colorSpace === "8bit") {
            if (this.#skipTagParsingErrors) {
                codeStack.pop();
                return null;
            }
            throw new Error("Color is outside of the color space (8bit)");
        }

        if (tag.startsWith("#")) return this.#colorToString(Color.fromHex(tag), isBackground);

        const list = tag.split(",");
        switch (list.length) {
            case 3: {
                const [r, g, b] = list;
                const rInt = parseFloat(r);
                const gInt = parseFloat(g);
                const bInt = parseFloat(b);

                if (Number.isNaN(rInt) || Number.isNaN(gInt) || Number.isNaN(bInt)) throw new Error("NaN found inside the list");
                return this.#colorToString(new Color(rInt, gInt, bInt), isBackground);
            }
            case 4: {
                const [space, r, g, b] = list;

                const colorSpaceFn = ColorSpaceMap[space.toUpperCase()];
                if (typeof colorSpaceFn === "undefined") throw new Error("Invalid ColorSpace");

                const rInt = parseFloat(r);
                const gInt = parseFloat(g);
                const bInt = parseFloat(b);

                if (Number.isNaN(rInt) || Number.isNaN(bInt) || Number.isNaN(gInt)) throw new Error("NaN found inside the list");

                // eslint-disable-next-line @typescript-eslint/ban-types
                return this.#colorToString((<Function>Color[colorSpaceFn as never])(rInt, gInt, bInt) as Color, isBackground);
            }
            default:
                throw new Error(`Invalid color "${tag}"`);
        }
    }

    #colorToString(color: Color, isBackground: boolean): string {
        return `${isBackground ? 48 : 38};2;${color.red8Bit};${color.green8Bit};${color.blue8Bit}`;
    }

    #mergeCodes(stack: Array<string>): Array<string> {
        const newStack: Array<string> = [];
        for (let i = 0, { length } = stack; i < length; i++) {
            const string = stack[i];

            if (string.startsWith("\x1B")) {
                if (!stack[i + 1]?.startsWith("\x1B")) {
                    newStack.push(string);
                    continue;
                }

                let str = string.slice(0, -1);

                while (stack[i + 1]?.startsWith("\x1B")) {
                    const code = stack[i + 1].slice(2, -1);
                    if (str.includes(code)) {
                        i++;
                        continue;
                    }
                    str += `;${code}`;
                }

                str += "m";
                newStack.push(str);
                continue;
            }

            newStack.push(string);
        }

        return newStack;
    }
}

export function parse(string: string): string {
    const parser = new StringParser(
        Bun.env.COLOR_SPACE as MacroColorSpace,
        Bun.env.CLOSING_CHARACTER,
        Bun.env.BACKGROUND_TOKEN,
        !!Bun.env.SKIP_PARSING_ERRORS
    );
    return parser.parse(string);
}
