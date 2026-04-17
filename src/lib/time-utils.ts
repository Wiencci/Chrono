
export function getDayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export function getDecimalDate(date: Date) {
  const year = date.getFullYear();
  const dayOfYear = getDayOfYear(date);
  const leap = isLeapYear(year);
  const monthLengths = [36, 37, 36, 37, 36, 37, 36, 37, 36, leap ? 38 : 37];
  let currentDay = dayOfYear;
  let month = 1;
  for (let i = 0; i < 10; i++) {
    if (currentDay <= monthLengths[i]) {
      month = i + 1;
      break;
    }
    currentDay -= monthLengths[i];
  }
  const dayOfMonth = currentDay;
  const dayOfWeek = ((dayOfYear - 1) % 9) + 1;
  return { year, month, dayOfMonth, dayOfWeek, dayOfYear };
}

export function getDecimalTime(date: Date) {
  const msSinceMidnight = date.getHours() * 3600000 + date.getMinutes() * 60000 + date.getSeconds() * 1000 + date.getMilliseconds();
  const totalDecimalSeconds = msSinceMidnight / 864;
  const hours = Math.floor(totalDecimalSeconds / 10000);
  const minutes = Math.floor((totalDecimalSeconds % 10000) / 100);
  const seconds = Math.floor(totalDecimalSeconds % 100);
  return { hours, minutes, seconds, totalDecimalSeconds };
}

export function getSunTimes(lat: number, lng: number, date: Date) {
  const rad = Math.PI / 180;
  const d = getDayOfYear(date);
  const declination = 23.45 * Math.sin(rad * (360 / 365) * (d - 81));
  const eqTime = 9.87 * Math.sin(2 * rad * (360 / 365) * (d - 81)) - 7.53 * Math.cos(rad * (360 / 365) * (d - 81)) - 1.5 * Math.sin(rad * (360 / 365) * (d - 81));
  let cosHA = -Math.tan(rad * lat) * Math.tan(rad * declination);
  cosHA = Math.max(-1, Math.min(1, cosHA));
  const hourAngle = Math.acos(cosHA) / rad;
  const sunrise = 12 - (hourAngle / 15) - (lng / 15) - (eqTime / 60);
  const sunset = 12 + (hourAngle / 15) - (lng / 15) - (eqTime / 60);
  const tzOffset = date.getTimezoneOffset() / 60;
  return { rise: sunrise - tzOffset, set: sunset - tzOffset };
}
