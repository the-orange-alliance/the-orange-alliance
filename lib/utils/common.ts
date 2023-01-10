import { Region, Season, Event } from '@the-orange-alliance/api/lib/cjs/models';
import Team from '@the-orange-alliance/api/lib/cjs/models/Team';
import { DateTime } from 'luxon';

export function readableDate(date: Date | string): string {
  if (!date) return '';
  if (typeof date === 'string') date = new Date(date);
  if (typeof date.getMonth !== 'function') return '';
  const shortMonth = getShortMonth(date.getMonth());
  return `${shortMonth} ${date.getDate() + 1}, ${date.getFullYear()}`;
}

export function readableTime(date: Date | string): string {
  if (!date) return '';
  if (typeof date === 'string') date = new Date(date);
  if (typeof date.getHours !== 'function') return '';
  const hour = date.getHours() + 1;
  const min = date.getMinutes();
  const h = (hour < 10 ? '0' : '') + (hour > 12 ? hour - 12 : hour);
  const m = (min < 10 ? '0' : '') + min;
  return `${h}:${m} ${date.getHours() > 11 ? 'PM' : 'AM'}`;
}

export function colorCalc(selected: boolean, color: string, win: boolean) {
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

export function getShortMonth(month: number) {
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

export function getWeekShort(week: any) {
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

export const undefinedToNull = (o: any): object | null => {
  if (typeof o === 'undefined' || o === null) return null;
  for (const key of Object.keys(o)) {
    if (typeof o[key] === 'undefined') o[key] = null;
    if (Array.isArray(o[key])) { // Parse nested arrays
      for (const item in o[key]) o[key][item] = undefinedToNull(o[key][item]);
    } else if (!Array.isArray(o[key]) && typeof o[key] === 'object') { // Parse nested objects
      o[key] = undefinedToNull(o[key]);
    }
  }
  return o;
};

export const getSeasonString = (season: Season) => {
  const codeOne = season.seasonKey.toString().substring(0, 2);
  const codeTwo = season.seasonKey.toString().substring(2, 4);
  return '20' + codeOne + '/' + codeTwo + ' - ' + season.description;
};

export function getRegionString(region: Region) {
  if (region.regionKey === 'all') return region.description;
  return `${region.description} (${region.regionKey.toUpperCase()})`;
}

export function getWeekName(week: string) {
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
      if (week && week.match('-?\\d+(\\.\\d+)?')) {
        // match a number with optional '-' and decimal.
        return 'Week ' + week;
      } else {
        return week;
      }
  }
}

export function teamToStrippedJson(team: Team) {
  return {
    team_key: team.teamKey,
    region_key: team.regionKey,
    league_key: team.leagueKey,
    team_name_short: team.teamNameShort,
    team_name_long: team.teamNameLong,
    city: team.city,
    state_prov: team.stateProv,
    country: team.country
  };
}

export function getEventDescription(event: Event) {
  const location = `${event.city}, ${event.stateProv ? event.stateProv + ', ' : ''}${
    event.country
  }`;
  const startDate = DateTime.fromISO(event.startDate);
  const endDate = DateTime.fromISO(event.endDate);

  if (startDate.hasSame(endDate, 'day')) {
    return `${location} on ${startDate.toLocaleString(DateTime.DATE_MED)}`;
  } else {
    return `${location} from ${startDate.toFormat('MMM LL')} to ${endDate.toLocaleString(
      DateTime.DATE_MED
    )}`;
  }
}

export function isSameDay(d1: Date, d2: Date) {
  if (typeof d1.getDate !== 'function' || typeof d2.getDate !== 'function') return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
