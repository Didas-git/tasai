export function getNormalizerWithBG(isBackground: boolean): string {
    return `\x1B[${isBackground ? 49 : 39}m`;
}
