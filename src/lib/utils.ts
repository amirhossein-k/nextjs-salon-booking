export function toPersianDigits(str: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.toString().replace(/\d/g, (x) => persianDigits[parseInt(x)]);
}

export function formatPersianDate(date: any, formatStr: string = 'YYYY/MM/DD'): string {
  if (!date) return '';
  // Assuming date is an instance of persian-date
  return toPersianDigits(date.format(formatStr));
}
