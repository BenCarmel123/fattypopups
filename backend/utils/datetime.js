export function resolveEndDatetime(start, end) {
    if (!end || end < start) return start;
    return end;
}
