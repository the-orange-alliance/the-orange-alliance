import {Season} from "@the-orange-alliance/api/lib/cjs/models";

function readableDate(date: Date | string): string {
  if (typeof date === "string") date = new Date(date);
  const shortMonth = getShortMonth(date.getMonth());
  return `${shortMonth} ${date.getDay()}, ${date.getFullYear()}`;
}

function getShortMonth(month: number) {
  switch (month) {
    case 0:
      return "Jan";
    case 1:
      return "Feb";
    case 2:
      return "Mar";
    case 3:
      return "Apr";
    case 4:
      return "May";
    case 5:
      return "Jun";
    case 6:
      return "Jul";
    case 7:
      return "Aug";
    case 8:
      return "Sep";
    case 9:
      return "Oct";
    case 10:
      return "Nov";
    case 11:
      return "Dec";
  }
}

const undefinedToNull = (o: any): object | null => {
  if(typeof o === 'undefined' || o === null) return null;
  for (const key of Object.keys(o)) {
    if (typeof o[key] === 'undefined') o[key] = null;
    if (Array.isArray(o[key])) {
      for(const item in o[key]) o[key][item] = undefinedToNull(o[key][item]);
    }
  }
  return o;
}

const getSeasonString = (season: Season) => {
  const codeOne = season.seasonKey.toString().substring(0, 2);
  const codeTwo = season.seasonKey.toString().substring(2, 4);
  return "20" + codeOne + "/" + codeTwo + " - " + season.description;
}

export { readableDate, undefinedToNull, getSeasonString };
