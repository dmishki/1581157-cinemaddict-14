const createFilter = (filters) => {
  const {
    name,
    count,
  } = filters;

  return `<a href="#${name}" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${count}</span></a>`;
};

const createSiteMenu = (filters) => {
  const filterItem = filters.map((filter) => createFilter(filter)).join('');

  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${filterItem}
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`;
};

const createSiteSorting = () => {
  return `<ul class="sort">
  <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
  <li><a href="#" class="sort__button">Sort by date</a></li>
  <li><a href="#" class="sort__button">Sort by rating</a></li>
</ul>`;
};

export {
  createSiteMenu,
  createSiteSorting
};
