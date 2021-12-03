import { Region, Season, Event } from '@the-orange-alliance/api/lib/cjs/models';
import Team from '@the-orange-alliance/api/lib/cjs/models/Team';

function readableDate(date: Date | string): string {
  if (typeof date === 'string') date = new Date(date);
  const shortMonth = getShortMonth(date.getMonth());
  return `${shortMonth} ${date.getDate() + 1}, ${date.getFullYear()}`;
}

function readableTime(date: Date | string): string {
  if (typeof date === 'string') date = new Date(date);
  const hour = date.getHours() + 1;
  const min = date.getMinutes();
  const h = (hour < 10 ? '0' : '') + (hour > 12 ? hour - 12 : hour);
  const m = (min < 10 ? '0' : '') + min;
  return `${h}:${m} ${date.getHours() > 11 ? 'PM' : 'AM'}`;
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

function base64ArrayBuffer(arrayBuffer: ArrayBuffer) {
  let base64 = '';
  const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  const bytes = new Uint8Array(arrayBuffer);
  const byteLength = bytes.byteLength;
  const byteRemainder = byteLength % 3;
  const mainLength = byteLength - byteRemainder;

  let a, b, c, d;
  let chunk;

  // Main loop deals with bytes in chunks of 3
  for (let i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
    d = chunk & 63; // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength];

    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4; // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '==';
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2; // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '=';
  }

  return base64;
}

function stringToArrayBuffer(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  const bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function teamToStrippedJson(team: Team) {
  return {
    team_key: team.teamKey,
    region_key: team.regionKey,
    league_key: team.leagueKey,
    team_name_short: team.teamNameShort,
    team_name_long: team.teamNameLong
  };
}

export {
  readableDate,
  readableTime,
  undefinedToNull,
  getSeasonString,
  getRegionString,
  getWeekName,
  getWeekShort,
  colorCalc,
  base64ArrayBuffer,
  stringToArrayBuffer,
  teamToStrippedJson
};
