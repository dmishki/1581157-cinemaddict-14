import SiteMenuView from './view/menu.js';
import UserProfileView from './view/user-profile.js';
import FilmsQuanityView from './view/films-quantity.js';
import FilmListPresenter from './presenter/filmsList.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import FiltersPresenter from './presenter/filters.js';

import {
  generateFilmCard
} from './mock/film.js';

import {
  render,
  RenderPosition
} from './utils/render.js';

const FILMS_COUNT = 15;
const siteBody = document.querySelector('body');
const siteHeader = siteBody.querySelector('.header');
const siteMain = siteBody.querySelector('.main');
const siteFooter = siteBody.querySelector('.footer');
const footerStatistics = siteFooter.querySelector('.footer__statistics');

const filmCards = new Array(FILMS_COUNT).fill().map(generateFilmCard);

const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
filmsModel.setFilms(filmCards);

const filmListPresenter = new FilmListPresenter(siteMain, filmsModel, filterModel);

render(siteHeader, new UserProfileView(), RenderPosition.BEFOREEND);
render(siteMain, new SiteMenuView(), RenderPosition.BEFOREEND);


const filtersPresenter = new FiltersPresenter(document.querySelector('.main-navigation'), filterModel, filmsModel);
filtersPresenter.init();
filmListPresenter.init();

render(footerStatistics, new FilmsQuanityView(filmCards), RenderPosition.BEFOREEND);
