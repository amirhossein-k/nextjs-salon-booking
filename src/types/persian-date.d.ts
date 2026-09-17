declare module 'persian-date' {
  interface PersianDate {
    format(format: string): string;
  }

  interface GregorianDate {
    year: number;
    month: number;
    day: number;
  }

  function toGregorian(year: number, month: number, day: number): GregorianDate;

  class PersianDateConstructor {
    constructor(timestamp?: number | Date | string | number[]);
    format(format: string): string;
  }

  export default PersianDateConstructor;
  export { toGregorian };
}
