import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

export const isDatesEqual = (dateA, dateB) => {
  return (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, 'D');
};

export const getFromDate = (days) => {
  return dayjs().subtract(days, 'day').toDate();
};

export const getDatesInRange = (dateFrom) => {
  const dates = [];
  const stepDate = new Date(dateFrom);
  const today = dayjs(new Date());

  while (dayjs(stepDate).isSameOrBefore(today)) {
    dates.push(new Date(stepDate));
    stepDate.setDate(stepDate.getDate() + 1);
  }

  return dates;
};

export const calculateDurationHours = (totalDuration) => {
  return Math.floor(totalDuration / 60);
};

export const calculateDurationMinutes = (totalDuration, hours) => {
  return totalDuration - (hours * 60);
};

export const calculateRuntime = (runtimeMinutes) => {
  const hours = Math.floor(runtimeMinutes / 60);
  const minutes = runtimeMinutes - (hours * 60);
  return hours + 'h ' + minutes + 'm';
};
