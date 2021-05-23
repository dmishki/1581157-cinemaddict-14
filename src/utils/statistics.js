import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

const makeGenresUniq = (films) => {
  const genres = new Set();
  films.map((film) => film.genres.forEach((genre) => genres.add(genre)));
  return Array.from(genres);
};

const countFilmsByGenre = (films, genre) => {
  return films.filter((film) => film.genres.filter((item) => item === genre).length);
};

const calculateTotalDuration = (films) => {
  let totalDuration = 0;
  films.forEach((film) => totalDuration += film.runtime);
  return totalDuration;
};

const calculateTotalFilmsStats = (films) => {
  const genres = makeGenresUniq(films);
  const filmsCountByGenres = genres.map((genre) => countFilmsByGenre(films, genre).length);
  const maxFilmsCount = Math.max(...filmsCountByGenres);
  const maxFilmsCountIndex = filmsCountByGenres.indexOf(maxFilmsCount);

  return {
    genres: genres,
    filmsCountList: filmsCountByGenres,
    totalFilms: films.length,
    totalDuration: calculateTotalDuration(films),
    topFilm: genres[maxFilmsCountIndex],
  };
};

const isDatesEqual = (dateA, dateB) => {
  return (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, 'D');
};

const getFromDate = (days) => {
  return dayjs().subtract(days, 'day').toDate();
};

const getDatesInRange = (dateFrom) => {
  const dates = [];
  const stepDate = new Date(dateFrom);
  const today = dayjs(new Date());

  while (dayjs(stepDate).isSameOrBefore(today)) {
    dates.push(new Date(stepDate));
    stepDate.setDate(stepDate.getDate() + 1);
  }

  return dates;
};

const countFilmsInDateRange = (days, films) => {
  const daysAgo = getFromDate(days);
  const datesList = getDatesInRange(daysAgo);
  const filmsSet = new Set();
  datesList.filter((date) => films.filter((film) => isDatesEqual(film.date, date)).forEach((item) => filmsSet.add(item)));
  return Array.from(filmsSet);
};

export {
  makeGenresUniq,
  calculateTotalFilmsStats,
  countFilmsInDateRange
};
