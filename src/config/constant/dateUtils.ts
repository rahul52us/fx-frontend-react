import moment from "moment";

export const SHORT_DATE_FORMAT: string = "MMM D, YYYY";
export const MEDIUM_DATE_FORMAT: string = "MMMM D, YYYY";
export const LONG_DATE_FORMAT: string = "dddd, MMMM D, YYYY";
export const DDMMYYYY_FORMAT: string = "DD/MM/YYYY";
export const DDMMYYYY_DASH_FORMAT: string = "DD-MM-YYYY";
export const YYYYMMDD_FORMAT: string = "YYYY/MM/DD";

export enum DateTimeOrder {
  DateFirst = "DateFirst",
  TimeFirst = "TimeFirst",
}

export const convertToReadableIST = (isoDate : string) => {
  if (!isoDate) {
    return null;
  }

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) {
    return null;
  }

  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is 5 hours and 30 minutes ahead of UTC
  const istDate = new Date(date.getTime() + istOffset);

  // Formatting the date and time in IST
  const formattedDate = istDate.toISOString().replace('T', ' ').split('.')[0];

  return formattedDate;
};

export const convertDateToReadable = (isoDate : string) => {
  if (!isoDate) {
    return null;
  }

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) {
    return null;
  }

  const istDate = new Date(date.getTime());

  // Formatting the date and time in IST
  const formattedDate = istDate.toISOString().replace('T', ' ').split('.')[0];

  return formattedDate;
};


export function formatDate(date: Date, format?: string): string {
  try
  {
    return moment(date).format(format || DDMMYYYY_FORMAT);
  }
  catch {
    return "--"
  }
}

const TABLE_DATE_KEY_PATTERN =
  /(date|dob|doj|createdat|updatedat|modifiedat|confirmedat|confirmationdate|publishedat|publisheddate|effectiveto|effectivefrom|disbursementfrom|startdate|enddate|duedate|bookingdate|invoicedate|bldate|podate|spotonbmkdate|premiumonbmkdate|drawdowndate|deliverydatefrom|deliverydateto|pcfcinputdate|forwardinputdate|forwardmodificationdate|exposureinputdate|exposuremodificationdate)/i;

export function isTableDateColumn(column?: {
  key?: string;
  headerName?: string;
  type?: string;
}): boolean {
  if (!column) return false;

  if (column.type === "date") return true;

  const key = (column.key || "").replace(/[^a-zA-Z]/g, "");
  const headerName = (column.headerName || "").replace(/[^a-zA-Z]/g, "");

  return TABLE_DATE_KEY_PATTERN.test(key) || TABLE_DATE_KEY_PATTERN.test(headerName);
}

export function formatTableDate(value: any): string {
  if (value === undefined || value === null || value === "") {
    return "--";
  }

  const rawValue =
    typeof value === "string"
      ? value.replace(/&#x[0-9a-f]+;?/gi, " ").trim()
      : value;

  if (typeof rawValue === "string") {
    const dashSeparatedDateWithTime = rawValue.match(
      /^(\d{2})-(\d{2})-(\d{4})(?:\s+\d{1,2}:\d{2}(?::\d{2})?.*)?$/
    );
    if (dashSeparatedDateWithTime) {
      return `${dashSeparatedDateWithTime[1]}-${dashSeparatedDateWithTime[2]}-${dashSeparatedDateWithTime[3]}`;
    }

    const dotSeparatedDate = rawValue.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (dotSeparatedDate) {
      return `${dotSeparatedDate[1]}-${dotSeparatedDate[2]}-${dotSeparatedDate[3]}`;
    }

    const slashSeparatedDate = rawValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (slashSeparatedDate) {
      return `${slashSeparatedDate[1]}-${slashSeparatedDate[2]}-${slashSeparatedDate[3]}`;
    }
  }

  const momentDate = moment(rawValue);

  if (!momentDate.isValid()) {
    return String(value).replace(/\./g, "-");
  }

  return momentDate.format(DDMMYYYY_DASH_FORMAT);
}

export function manipulateDateWithMonth(date: Date, numberOfMonths: number, type: 'add' | 'sub'): string {
  const manipulatedDate = moment(date);
  if (type === 'add') {
    manipulatedDate.add(numberOfMonths, 'months');
  } else {
    manipulatedDate.subtract(numberOfMonths, 'months');
  }
  return manipulatedDate.format('YYYY-MM-DD');
}


// dateUtils.ts
export function formatDateTime(
  timestamp: string,
  format?: string,
  includeSeconds: boolean = true,
  dateTimeOrder?: DateTimeOrder,
): string {

  const momentDate = moment(timestamp);

  if (!momentDate.isValid()) {
    return '-';
  }

  const order = dateTimeOrder || DateTimeOrder.DateFirst;
  const dateFormat = format || DDMMYYYY_FORMAT;
  const timeFormat = includeSeconds ? 'h:mm:ss A' : 'h:mm A';

  const dateTimeFormat =
    order === DateTimeOrder.DateFirst
      ? `${dateFormat}, ${timeFormat}`
      : `${timeFormat}, ${dateFormat}`;

  const formattedDateTime = moment(timestamp).format(dateTimeFormat);
  return formattedDateTime;
}


export function getCustomTextDate(
  title: string,
  dateString: any,
  format?: string
) {
  try {
    const date = moment.utc(dateString);
    const formattedDate = date.format(format || SHORT_DATE_FORMAT);
    return `${title} ${formattedDate}`;
  } catch (_) {
    return ``;
  }
}

export const currentYear = new Date();
export const oneYearLater = new Date(
  currentYear.getFullYear() + 1,
  currentYear.getMonth(),
  currentYear.getDate()
);

const currentDates = moment();

export const currentYears = currentDates.format('YYYY');
export const currentMonth = currentDates.format('MM');
export const currentDateValue = currentDates.format('DD');

// Get the current date
const currentDate = new Date();

// Set the current date's time to midnight (00:00:00) to represent the start of the day
currentDate.setHours(0, 0, 0, 0);

// Create a new Date object for the next day
const nextDay = new Date(currentDate);

// Add 1 day to the current date to get the next day
nextDay.setDate(currentDate.getDate() + 1);

// Export the current day (midnight to midnight)
export const currentDay = currentDate;

// Export the next day (midnight to midnight)
export const nextDayMidnight = nextDay;
