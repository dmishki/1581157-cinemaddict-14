import {
  createSiteMenu,
  createSiteSorting
} from './view/menu.js';

import {
  createFilmCard,
  createFilmList
} from './view/film-card.js';

import {
  createUserProfile
} from './view/user-profile.js';

import {
  createFilmDetailsPopup
} from './view/film-details.js';

import {
  createFilmsQuanity
} from './view/films-quantity.js';

const PHOTOS_COUNT = 5;
const EXTRA_CARDS_COUNT = 2;
const siteBody = document.querySelector('body');
const siteHeader = siteBody.querySelector('.header');
const siteMain = siteBody.querySelector('.main');
const siteFooter = siteBody.querySelector('.footer');
const footerStatistics = siteFooter.querySelector('.footer__statistics');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderFilmCards = (cardsQuantity) => {
  const filmListContainer = siteMain.querySelector('.films-list__container');
  for (let i = 0; i < cardsQuantity; i++) {
    render(filmListContainer, createFilmCard(), 'beforeend');
  }
};

const renderFilmExtraCards = (cardsQuantity) => {
  const filmListArray = siteMain.querySelectorAll('.films-list--extra');

  filmListArray.forEach(filmList => {
    const filmListContainer = filmList.querySelector('.films-list__container');
    for (let i = 0; i < cardsQuantity; i++) {
      render(filmListContainer, createFilmCard(), 'beforeend');
    }
  })
};

render(siteHeader, createUserProfile(), 'beforeend');
render(siteMain, createSiteMenu(), 'beforeend');
render(siteMain, createSiteSorting(), 'beforeend');
render(siteMain, createFilmList(), 'beforeend');
renderFilmCards(PHOTOS_COUNT);
renderFilmExtraCards(EXTRA_CARDS_COUNT);
render(footerStatistics, createFilmsQuanity(), 'beforeend');
render(siteBody, createFilmDetailsPopup(), 'beforeend');
