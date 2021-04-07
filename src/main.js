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

import {
  generateFilmCard
} from './view/film-information.js';

import {
  generateFilter
} from './view/filters.js';

const FILMS_COUNT = 20;
const FILMS_RENDERING_STEP = 5;
const EXTRA_CARDS_COUNT = 2;
const siteBody = document.querySelector('body');
const siteHeader = siteBody.querySelector('.header');
const siteMain = siteBody.querySelector('.main');
const siteFooter = siteBody.querySelector('.footer');
const footerStatistics = siteFooter.querySelector('.footer__statistics');

const filmCards = new Array(FILMS_COUNT).fill().map(generateFilmCard);
const filtersValues = generateFilter(filmCards);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderFilmCards = (cardsQuantity, filmsArray) => {
  const filmListContainer = siteMain.querySelector('.films-list__container');
  for (let i = 0; i < cardsQuantity; i++) {
    render(filmListContainer, createFilmCard(filmsArray[i]), 'beforeend');
  }
};

const renderFilmExtraCards = (cardsQuantity) => {
  const filmLists = siteMain.querySelectorAll('.films-list--extra');

  filmLists.forEach((filmList) => {
    const filmListContainer = filmList.querySelector('.films-list__container');
    for (let i = 0; i < cardsQuantity; i++) {
      render(filmListContainer, createFilmCard(filmCards[i]), 'beforeend');
    }
  });
};

render(siteHeader, createUserProfile(), 'beforeend');
render(siteMain, createSiteMenu(filtersValues), 'beforeend');
render(siteMain, createSiteSorting(), 'beforeend');
render(siteMain, createFilmList(), 'beforeend');


if (filmCards.length >= FILMS_RENDERING_STEP) {
  let renderedFilmsCount = FILMS_RENDERING_STEP;
  renderFilmCards(renderedFilmsCount, filmCards);
  let filmsCardsToRender = filmCards.slice(renderedFilmsCount, filmCards.length);
  const showMoreButton = document.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    renderFilmCards(FILMS_RENDERING_STEP, filmsCardsToRender);
    renderedFilmsCount += FILMS_RENDERING_STEP;
    filmsCardsToRender = filmCards.slice(renderedFilmsCount, filmCards.length);

    if (filmsCardsToRender.length < FILMS_RENDERING_STEP) {
      showMoreButton.remove();
    }
  });
}

renderFilmExtraCards(EXTRA_CARDS_COUNT);
render(footerStatistics, createFilmsQuanity(filmCards), 'beforeend');
render(siteBody, createFilmDetailsPopup(filmCards[0]), 'beforeend');

if (document.querySelector('.film-details__close-btn')) {
  document.querySelector('.film-details__close-btn').addEventListener('click', (evt) => {
    evt.preventDefault();
    document.querySelector('.film-details').remove();
    siteBody.classList.remove('hide-overflow');
  });
}
