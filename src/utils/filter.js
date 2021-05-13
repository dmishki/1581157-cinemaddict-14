import {
  FilterType
} from '../const.js';

export const filter = {
  [FilterType.ALL]: (films) => films.filter((film) => film),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
};
