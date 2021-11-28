import { Region, Season } from '@the-orange-alliance/api/lib/cjs/models';

function readableDate(date: Date | string): string {
  if (typeof date === 'string') date = new Date(date);
  const shortMonth = getShortMonth(date.getMonth());
  return `${shortMonth} ${date.getDay()}, ${date.getFullYear()}`;
}

function colorCalc(selected: boolean, color: string, win: boolean) {
  if (selected) {
    return '#fbcc81';
  } else if (win) {
    if (color === 'red') {
      return '#ffe5e5';
    } else {
      return '#e5e5ff';
    }
  } else {
    if (color === 'red') {
      return 'rgba(255,82,82,.13)';
    } else {
      return 'rgba(68,138,255,.13)';
    }
  }
}

function getShortMonth(month: number) {
  switch (month) {
    case 0:
      return 'Jan';
    case 1:
      return 'Feb';
    case 2:
      return 'Mar';
    case 3:
      return 'Apr';
    case 4:
      return 'May';
    case 5:
      return 'Jun';
    case 6:
      return 'Jul';
    case 7:
      return 'Aug';
    case 8:
      return 'Sep';
    case 9:
      return 'Oct';
    case 10:
      return 'Nov';
    case 11:
      return 'Dec';
  }
}

function getWeekShort(week: any) {
  const parsed = parseInt(week);
  if (!isNaN(parsed)) {
    return `Wk ${week}`;
  }
  switch (week) {
    case 'January':
      return 'Jan';
    case 'February':
      return 'Feb';
    case 'March':
      return 'Mar';
    case 'April':
      return 'Apr';
    case 'May':
      return 'May';
    case 'June':
      return 'Jun';
    case 'July':
      return 'Jul';
    case 'August':
      return 'Aug';
    case 'September':
      return 'Sep';
    case 'October':
      return 'Oct';
    case 'November':
      return 'Nov';
    case 'December':
      return 'Dec';
    case 'CMPDET':
      return 'Det. CMP';
    case 'CMPHOU':
      return 'Hou. CMP';
    case 'NSR':
      return 'North Sup. Reg.';
    case 'WSR':
      return 'West Sup. Reg.';
    case 'SPRING':
      return 'Spring';
    case 'FOC':
      return 'Fest. of Cmps.';
    default:
      return week;
  }
}

const undefinedToNull = (o: any): object | null => {
  if (typeof o === 'undefined' || o === null) return null;
  for (const key of Object.keys(o)) {
    if (typeof o[key] === 'undefined') o[key] = null;
    if (Array.isArray(o[key])) {
      for (const item in o[key]) o[key][item] = undefinedToNull(o[key][item]);
    }
  }
  return o;
};

const getSeasonString = (season: Season) => {
  const codeOne = season.seasonKey.toString().substring(0, 2);
  const codeTwo = season.seasonKey.toString().substring(2, 4);
  return '20' + codeOne + '/' + codeTwo + ' - ' + season.description;
};

function getRegionString(region: Region) {
  if (region.regionKey === 'all') return region.description;
  return `${region.description} (${region.regionKey.toUpperCase()})`;
}

function getWeekName(week: string) {
  switch (week) {
    case 'CMP':
      return 'FIRST Championship';
    case 'CMPHOU':
      return 'FIRST Championship - Houston';
    case 'CMPSTL':
      return 'FIRST Championship - St. Louis';
    case 'CMPDET':
      return 'FIRST Championship - Detroit';
    case 'ESR':
      return 'East Super Regional Championship';
    case 'NSR':
      return 'North Super Regional Championship';
    case 'SSR':
      return 'South Super Regional Championship';
    case 'WSR':
      return 'West Super Regional Championship';
    case 'SPR':
      return 'Super Regionals';
    case 'FOC':
      return 'Festival of Champions';
    default:
      if (week.match('-?\\d+(\\.\\d+)?')) {
        // match a number with optional '-' and decimal.
        return 'Week ' + week;
      } else {
        return week;
      }
  }
}

export {
  readableDate,
  undefinedToNull,
  getSeasonString,
  getRegionString,
  getWeekName,
  getWeekShort,
  colorCalc
};
