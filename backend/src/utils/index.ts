import { TZDate } from '@date-fns/tz';
import * as cheerio from 'cheerio';
import { format } from 'date-fns';

export const chinesePhoneRegExp = /^(?:1[3-9]\d{9}|0\d{2,3}-?\d{7,8})$/;

export const htmlToText = (html: string): string => {
  if (!html) return '';

  const $ = cheerio.load(html);
  return $.text().trim();
};

export function formatDateTimeWithTZ(
  date: Date | string | number,
  formatStr: string = 'yyyy-MM-dd HH:mm:ssXXX',
  timeZone: string = 'Asia/Shanghai',
): string {
  // Convert to Date object
  const parsedDate = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  // Convert UTC date to target timezone
  const zonedDate = new TZDate(parsedDate, timeZone);

  // Format date in that timezone
  return format(zonedDate, formatStr);
}