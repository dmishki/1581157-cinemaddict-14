import SiteMenuView from './view/menu.js';
import UserProfileView from './view/user-profile.js';
import FilmsQuanityView from './view/films-quantity.js';
import FilmListPresenter from './presenter/filmsList.js';

import {
  generateFilmCard
} from './mock/film.js';

import {
  generateFilter
} from './view/filters.js';

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
const filtersValues = generateFilter(filmCards);

const filmListPresenter = new FilmListPresenter(siteMain);

render(siteHeader, new UserProfileView(), RenderPosition.BEFOREEND);
render(siteMain, new SiteMenuView(filtersValues), RenderPosition.BEFOREEND);

filmListPresenter.init(filmCards);

render(footerStatistics, new FilmsQuanityView(filmCards), RenderPosition.BEFOREEND);
