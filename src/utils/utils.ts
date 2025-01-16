export function isNullOrUndefinedOrEmptyOrNotNumber(value: any): boolean {
    return value === undefined || value === null || value === "" || isNaN(Number(value));
}

export function roundToDecimals(num: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
}