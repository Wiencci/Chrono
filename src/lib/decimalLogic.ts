
/**
 * DECIMALCHRONO v2.0 - Core Decimal Logic
 * Centralizing all 10-based conversions for the HUD.
 */

// --- TIME CONSTANTS ---
export const MS_PER_DAY = 86400000;
export const MS_PER_DEC_HOUR = 8640000;
export const MS_PER_DEC_MINUTE = 86400;
export const MS_PER_DEC_SECOND = 864;

// --- TIME CONVERSIONS ---
export const toDecimalTime = (date: Date) => {
  const msToday = (date.getHours() * 3600000) + (date.getMinutes() * 60000) + (date.getSeconds() * 1000) + date.getMilliseconds();
  const totalDecSeconds = msToday / MS_PER_DEC_SECOND;
  
  return {
    hours: Math.floor(totalDecSeconds / 10000),
    minutes: Math.floor((totalDecSeconds % 10000) / 100),
    seconds: Math.floor(totalDecSeconds % 100),
    milli: Math.floor((msToday % MS_PER_DEC_SECOND) / 0.864),
    totalDecSeconds
  };
};

export const formatDecimalDuration = (ms: number, includeMilli = false) => {
  const h = Math.floor(ms / MS_PER_DEC_HOUR);
  const m = Math.floor((ms % MS_PER_DEC_HOUR) / MS_PER_DEC_MINUTE);
  const s = Math.floor((ms % MS_PER_DEC_MINUTE) / MS_PER_DEC_SECOND);
  const ms_part = Math.floor((ms % MS_PER_DEC_SECOND) / 0.864);
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  const pad3 = (n: number) => n.toString().padStart(3, '0');
  
  let base = `${pad(h)}:${pad(m)}:${pad(s)}`;
  return includeMilli ? `${base}.${pad3(ms_part)}` : base;
};

export const toDecimalHour = (stdHour: number) => stdHour / 2.4;

// --- ANGLE CONVERSIONS (Standard -> 100 Degrees) ---
// 360 degrees = 100 decimal degrees
export const toDecimalDegrees = (deg: number) => {
  return (deg / 360) * 100;
};

export const formatDecimalDegrees = (deg: number) => {
  return `${toDecimalDegrees(deg).toFixed(1)}°D`;
};

// --- DATE CONVERSIONS ---
export const getDayOfYear = (date: Date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

export const toDecimalDate = (date: Date) => {
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
  return { 
    year, 
    month, 
    dayOfMonth: currentDay, 
    dayOfWeek: ((dayOfYear - 1) % 9) + 1, 
    dayOfYear 
  };
};

// --- ASTRONOMICAL CONVERSIONS ---
export const getSunTimes = (lat: number, lng: number, date: Date) => {
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
};

// --- DISTANCE/SPEED CONVERSIONS ---
export const toDecimalSpeed = (speedMs: number) => {
  return speedMs * 8.64;
};

export const toDecimalAltitude = (meters: number) => {
  return meters;
};
