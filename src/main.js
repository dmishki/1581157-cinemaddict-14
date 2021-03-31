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

const siteBody = document.querySelector('body');
const siteHeader = siteBody.querySelector('.header');
const siteMain = siteBody.querySelector('.main');
const siteFooter = siteBody.querySelector('.footer');
const footerStatistics = siteFooter.querySelector('.footer__statistics');
const PHOTOS_COUNT = 5;
const EXTRA_CARDS_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderFilmCards = function (cardsQuantity) {
  const filmListContainer = siteMain.querySelector('.films-list__container');
  for (let i = 0; i < cardsQuantity; i++) {
    render(filmListContainer, createFilmCard(), 'beforeend');
  }
};

const renderFilmExtraCards = function (cardsQuantity) {
  const filmListArray = siteMain.querySelectorAll('.films-list--extra');

  for (let i = 0; i < filmListArray.length; i++) {
    const filmListContainer = filmListArray[i].querySelector('.films-list__container');

    for (let j = 0; j < cardsQuantity; j++) {
      render(filmListContainer, createFilmCard(), 'beforeend');
    }
  }
};

render(siteHeader, createUserProfile(), 'beforeend');
render(siteMain, createSiteMenu(), 'beforeend');
render(siteMain, createSiteSorting(), 'beforeend');
render(siteMain, createFilmList(), 'beforeend');
renderFilmCards(PHOTOS_COUNT);
renderFilmExtraCards(EXTRA_CARDS_COUNT);
render(footerStatistics, createFilmsQuanity(), 'beforeend');
render(siteBody, createFilmDetailsPopup(), 'beforeend');
