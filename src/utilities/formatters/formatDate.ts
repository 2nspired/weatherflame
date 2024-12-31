import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
// const testDate = '2024-12-29T12:00:00-10:00';

export const formatDate = (date: string) => {
  return dayjs(date).format('ddd, D MMM');
};

export const formatShortDate = (date: string) => {
  return dayjs(date).format('D MMM');
};

export const formatDateHour = (date: string) => {
  return dayjs(date).format('h a');
};

export const dateAddDays = ({ date, days }: { date: string; days: number }) => {
  const newDate = dayjs(date).add(days, 'day').toString();
  return formatShortDate(newDate);
};

export const formatAsLocalDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};
