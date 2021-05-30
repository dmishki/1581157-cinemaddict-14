import {
  isDatesEqual,
  getFromDate,
  getDatesInRange
} from './dates.js';

const countFilmsByGenre = (films, genre) => {
  return films.filter((film) => film.genres.filter((item) => item === genre).length);
};

const calculateTotalDuration = (films) => {
  return films.reduce((acc, film) => acc + film.runtime, 0);
};

const calculateTotalFilmsStats = (films, genres) => {
  const filmsCountByGenres = genres.map((genre) => countFilmsByGenre(films, genre).length);
  const maxFilmsCount = Math.max(...filmsCountByGenres);
  const maxFilmsCountIndex = filmsCountByGenres.indexOf(maxFilmsCount);

  return {
    filmsCountList: filmsCountByGenres,
    totalFilms: films.length,
    totalDuration: calculateTotalDuration(films),
    topFilm: genres[maxFilmsCountIndex],
  };
};

const countFilmsInDateRange = (days, films) => {
  const daysAgo = getFromDate(days);
  const datesList = getDatesInRange(daysAgo);
  const filmsSet = new Set();
  datesList.filter((date) => films.filter((film) => isDatesEqual(film.watchingDate, date)).forEach((item) => filmsSet.add(item)));
  return Array.from(filmsSet);
};

export {
  calculateTotalFilmsStats,
  countFilmsInDateRange
};
