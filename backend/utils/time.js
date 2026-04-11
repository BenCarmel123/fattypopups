export function resolveEndDatetime(start, end) {
    if (!end || end < start) return start;
    return end;
}

export const getTimestamp = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
};
