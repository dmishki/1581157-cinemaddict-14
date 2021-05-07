const filmsToFiltersMap = {
  Watchlist: (films) => films.filter((film) => film.isWatchlist).length,
  History: (films) => films.filter((film) => film.isWatched).length,
  Favorites: (films) => films.filter((film) => film.isFavorite).length,
};

const generateFilter = (films) => {
  return Object.entries(filmsToFiltersMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(films),
    };
  });
};

export {
  generateFilter
};
