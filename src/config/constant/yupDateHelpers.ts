export const parseDateValue = (val: any): Date | null => {
  if (!val || val === "") return null;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed) return null;

    // DD-MM-YYYY or DD/MM/YYYY or DD.MM.YYYY
    const dmyMatch = trimmed.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
    if (dmyMatch) {
      const day = parseInt(dmyMatch[1], 10);
      const month = parseInt(dmyMatch[2], 10) - 1;
      const year = parseInt(dmyMatch[3], 10);
      const d = new Date(year, month, day);
      return !isNaN(d.getTime()) && d.getDate() === day && d.getMonth() === month ? d : null;
    }

    // YYYY-MM-DD or YYYY/MM/DD
    const ymdMatch = trimmed.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
    if (ymdMatch) {
      const year = parseInt(ymdMatch[1], 10);
      const month = parseInt(ymdMatch[2], 10) - 1;
      const day = parseInt(ymdMatch[3], 10);
      const d = new Date(year, month, day);
      return !isNaN(d.getTime()) && d.getDate() === day && d.getMonth() === month ? d : null;
    }

    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
};

export const transformDate = (curr: any, orig: any) => {
  if (!orig || orig === "") return null;
  const parsed = parseDateValue(orig);
  return parsed ?? (isNaN(new Date(orig).getTime()) ? curr : new Date(orig));
};
