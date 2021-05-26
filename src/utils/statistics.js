import {
  FilmGenres
} from '../const.js';

import {
  isDatesEqual,
  getFromDate,
  getDatesInRange
} from './dates.js';

const countFilmsByGenre = (films, genre) => {
  return films.filter((film) => film.genres.filter((item) => item === genre).length);
};

const calculateTotalDuration = (films) => {
  return films.reduce((acc, it) => acc + it.runtime, 0);
};

const calculateTotalFilmsStats = (films) => {
  const filmsCountByGenres = FilmGenres.map((genre) => countFilmsByGenre(films, genre).length);
  const maxFilmsCount = Math.max(...filmsCountByGenres);
  const maxFilmsCountIndex = filmsCountByGenres.indexOf(maxFilmsCount);

  return {
    genres: FilmGenres,
    filmsCountList: filmsCountByGenres,
    totalFilms: films.length,
    totalDuration: calculateTotalDuration(films),
    topFilm: FilmGenres[maxFilmsCountIndex],
  };
};

const countFilmsInDateRange = (days, films) => {
  const daysAgo = getFromDate(days);
  const datesList = getDatesInRange(daysAgo);
  const filmsSet = new Set();
  datesList.filter((date) => films.filter((film) => isDatesEqual(film.date, date)).forEach((item) => filmsSet.add(item)));
  return Array.from(filmsSet);
};

export {
  calculateTotalFilmsStats,
  countFilmsInDateRange
};
