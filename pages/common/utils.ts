export function ToBool(v?: number | string | boolean | Booleanish): boolean {
    if (v === 1 || v === true || v === '1' || v === 'true') {
        return true;
    }
    return false;
}
