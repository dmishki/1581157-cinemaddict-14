import dayjs from 'dayjs';

import {
  FilterType
} from '../const.js';

import {
  filter
} from './filter.js';

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
  const MAX_YEAR_GAP = 2;
  const MAX_DAY_GAP = 7;

  const yearGap = getRandomInteger(-MAX_YEAR_GAP, 0);
  const dayGap = getRandomInteger(-MAX_DAY_GAP, 0);

  return dayjs().add(yearGap, 'year').add(dayGap, 'day').toDate();
};

const compareDates = (filmA, filmB) => {
  return dayjs(filmB.date).diff(dayjs(filmA.date));
};

const compareRatings = (filmA, filmB) => {
  return filmB.rating - filmA.rating;
};

const calculateProfileRank = (films) => {
  const watchedFilmsCount = filter[FilterType.HISTORY](films).length;

  switch (true) {
    case watchedFilmsCount === 0:
      return '';
    case watchedFilmsCount < 11:
      return 'Novice';
    case watchedFilmsCount < 21:
      return 'Fan';
    case watchedFilmsCount >= 21:
      return 'Movie buff';
  }
};

export {
  getRandomInteger,
  getRandomArrayElement,
  getRandomDate,
  compareDates,
  compareRatings,
  calculateProfileRank
};
