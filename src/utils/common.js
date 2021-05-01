import dayjs from 'dayjs';

// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (Array) => {
  const randomIndex = getRandomInteger(0, Array.length - 1);
  return Array[randomIndex];
};

const getRandomDate = () => {
  const MAX_YEAR_GAP = 70;
  const MAX_DAY_GAP = 14;

  const yearGap = getRandomInteger(-MAX_YEAR_GAP, 0);
  const dayGap = getRandomInteger(-MAX_DAY_GAP, 0);

  return dayjs().add(yearGap, 'year').add(dayGap, 'day').toDate();
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const compareDates = (filmA, filmB) => {
  return dayjs(filmB.date).diff(dayjs(filmA.date));
};

const compareRatings = (filmA, filmB) => {
  return filmB.rating - filmA.rating;
};

export {
  getRandomInteger,
  getRandomArrayElement,
  getRandomDate,
  updateItem,
  compareDates,
  compareRatings
};