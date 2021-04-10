import SiteMenuView from './view/menu.js';
import SiteSortingView from './view/sorting.js';
import UserProfileView from './view/user-profile.js';
import FilmsQuanityView from './view/films-quantity.js';
import FilmDetailsPopupView from './view/film-details.js';
import FilmsListView from './view/films-list.js';
import FilmCardView from './view/film-card.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FilmsSectionView from './view/films-section.js';
import NoFilmsView from './view/no-films.js';
import FilmsRatedView from './view/films-rated.js';
import FilmsCommentedView from './view/films-commented.js';

import {
  generateFilmCard
} from './mock/film.js';

import {
  generateFilter
} from './view/filters.js';

import {
  renderElement,
  RenderPosition
} from './view/utils.js';

const FILMS_COUNT = 15;
const FILMS_RENDERING_STEP = 5;
const EXTRA_CARDS_COUNT = 2;
const siteBody = document.querySelector('body');
const siteHeader = siteBody.querySelector('.header');
const siteMain = siteBody.querySelector('.main');
const siteFooter = siteBody.querySelector('.footer');
const footerStatistics = siteFooter.querySelector('.footer__statistics');

const filmCards = new Array(FILMS_COUNT).fill().map(generateFilmCard);
const filtersValues = generateFilter(filmCards);

const renderFilmCard = (filmsContainer, film) => {
  const filmCard = new FilmCardView(film);
  const filmDetailsPopup = new FilmDetailsPopupView(film);

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      removeFilmDetailsPopup();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const renderFilmDetailsPopup = () => {
    renderElement(siteBody, filmDetailsPopup.getElement(), RenderPosition.BEFOREEND);
    siteBody.classList.add('hide-overflow');
    document.addEventListener('keydown', onEscKeyDown);

    filmDetailsPopup.getElement().querySelector('.film-details__close-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      removeFilmDetailsPopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });
  };

  const removeFilmDetailsPopup = () => {
    filmDetailsPopup.getElement().remove();
    filmDetailsPopup.removeElement();
    siteBody.classList.remove('hide-overflow');
  };

  renderElement(filmsContainer, filmCard.getElement(), RenderPosition.BEFOREEND);

  filmCard.getElement().querySelector('.film-card__comments').addEventListener('click', (evt) => {
    evt.preventDefault();
    renderFilmDetailsPopup();
  });

  filmCard.getElement().querySelector('.film-card__poster').addEventListener('click', (evt) => {
    evt.preventDefault();
    renderFilmDetailsPopup();
  });

  filmCard.getElement().querySelector('.film-card__title').addEventListener('click', (evt) => {
    evt.preventDefault();
    renderFilmDetailsPopup();
  });
};

const renderFilmExtraCards = (cardsQuantity) => {
  const filmLists = siteMain.querySelectorAll('.films-list--extra');

  filmLists.forEach((filmList) => {
    const filmListContainer = filmList.querySelector('.films-list__container');
    for (let i = 0; i < cardsQuantity; i++) {
      renderElement(filmListContainer, new FilmCardView(filmCards[i]).getElement(), RenderPosition.BEFOREEND);
    }
  });
};

const filmsSection = new FilmsSectionView();
const filmsList = new FilmsListView();
const showMoreButton = new ShowMoreButtonView();

renderElement(siteHeader, new UserProfileView().getElement(), RenderPosition.BEFOREEND);
renderElement(siteMain, new SiteMenuView(filtersValues).getElement(), RenderPosition.BEFOREEND);
renderElement(siteMain, new SiteSortingView().getElement(), RenderPosition.BEFOREEND);
renderElement(siteMain, filmsSection.getElement(), RenderPosition.BEFOREEND);

if (filmCards.length === 0) {
  renderElement(filmsSection.getElement(), new NoFilmsView().getElement(), RenderPosition.BEFOREEND);
} else {
  renderElement(filmsSection.getElement(), filmsList.getElement(), RenderPosition.BEFOREEND);
  const filmsContainer = filmsList.getElement().querySelector('.films-list__container');

  let renderedFilmsCount = 0;
  filmCards
    .slice(renderedFilmsCount, FILMS_RENDERING_STEP)
    .forEach((it) => renderFilmCard(filmsContainer, it));
  renderedFilmsCount += FILMS_RENDERING_STEP;

  if (filmCards.length > FILMS_RENDERING_STEP) {
    renderElement(filmsList.getElement(), showMoreButton.getElement(), RenderPosition.BEFOREEND);
    showMoreButton.getElement().addEventListener('click', (evt) => {
      evt.preventDefault();
      filmCards
        .slice(renderedFilmsCount, renderedFilmsCount + FILMS_RENDERING_STEP)
        .forEach((it) => renderFilmCard(filmsContainer, it));
      renderedFilmsCount += FILMS_RENDERING_STEP;

      if (filmCards.length <= renderedFilmsCount) {
        showMoreButton.getElement().remove();
        showMoreButton.removeElement();
      }
    });
  }
}

renderElement(filmsSection.getElement(), new FilmsRatedView().getElement(), RenderPosition.BEFOREEND);
renderElement(filmsSection.getElement(), new FilmsCommentedView().getElement(), RenderPosition.BEFOREEND);
renderFilmExtraCards(EXTRA_CARDS_COUNT);
renderElement(footerStatistics, new FilmsQuanityView(filmCards).getElement(), RenderPosition.BEFOREEND);
