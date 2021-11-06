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

export { readableDate };
