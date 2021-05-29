import SiteMenuView from './view/menu.js';
import UserProfileView from './view/user-profile.js';
import FilmsQuanityView from './view/films-quantity.js';
import FilmListPresenter from './presenter/films-list.js';
import StatsView from './view/stats.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import FiltersPresenter from './presenter/filters.js';
import Api from './api.js';

import {
  MenuItem,
  UpdateType
} from './const.js';

import {
  render,
  RenderPosition
} from './utils/render.js';

const AUTHORIZATION = 'Basic uv3FY7idF6I498SJoEPxY4SF3Q9F2212212';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');
const footerStatistics = document.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);

const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
const userProfileView = new UserProfileView(filmsModel);

const filmListPresenter = new FilmListPresenter(siteMain, filmsModel, filterModel, api);
const siteMenuComponent = new SiteMenuView();

render(siteMain, siteMenuComponent, RenderPosition.BEFOREEND);

const filtersPresenter = new FiltersPresenter(document.querySelector('.main-navigation'), filterModel, filmsModel);
filtersPresenter.init();
filmListPresenter.init();

const statisticComponent = new StatsView(filmsModel);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILTERS:
      statisticComponent.resetToDefault();
      filtersPresenter.init();
      statisticComponent.hide();
      siteMenuComponent.hide();
      filmListPresenter.showFilms();
      break;
    case MenuItem.STATISTICS:
      statisticComponent.resetToDefault();
      statisticComponent.updateElement();
      filmListPresenter.hideFilms();
      filtersPresenter.removeActiveClass();
      statisticComponent.show();
      siteMenuComponent.show();
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(films, UpdateType.INIT);
  })
  .then(() => {
    const filmGenres = new Set();
    filmsModel.getFilms().map((film) => film.genres.forEach((genre) => filmGenres.add(genre)));
    filmsModel.setGenres(filmGenres);
    render(siteHeader, userProfileView, RenderPosition.BEFOREEND);
    render(siteMain, statisticComponent, RenderPosition.BEFOREEND);
    render(footerStatistics, new FilmsQuanityView(filmsModel.getFilms()), RenderPosition.BEFOREEND);
  })
  .catch(() => filmsModel.setFilms([], UpdateType.INIT));
