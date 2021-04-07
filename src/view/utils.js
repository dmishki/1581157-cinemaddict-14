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

export {
  getRandomInteger,
  getRandomArrayElement,
  getRandomDate
};
