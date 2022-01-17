import Moment from 'moment-timezone';

const GOOGLE_BASE_URL = 'https://calendar.google.com/calendar/render';

interface functionParams {
  text: string;
  start: string;
  end: string;
  url: string;
}

export const generateGoogleCalendarEvent = ({
  text,
  start,
  end,
}: functionParams): string => {
  const startDate = Moment(start).format('YYYYMMDDTHHmmss');
  const endDate = Moment(end).format('YYYYMMDDTHHmmss');
  return `${GOOGLE_BASE_URL}?action=TEMPLATE&text=${text}&dates=${startDate}/${endDate}`;
};

export const generateAppleCalendarEvent = ({
  start,
  end,
}: {
  start: string;
  end: string;
}): string => {
  const startDate = Moment(start).format('YYYYMMDDTHHmmss');
  const endDate = Moment(end).format('YYYYMMDDTHHmmss');
  return `/api/confirmation/?startDate=${startDate}&endDate=${endDate}`;
};
