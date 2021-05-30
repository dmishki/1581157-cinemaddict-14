import dayjs from 'dayjs';

import {
  FilterType
} from '../const.js';

import {
  filter
} from './filter.js';

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

const formatDescription = (description) => {
  if (description.length > 140) {
    return description.slice(0, 139) + '...';
  }

  return description;
};

export {
  compareDates,
  compareRatings,
  calculateProfileRank,
  formatDescription
};
