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
  render,
  RenderPosition,
  remove
} from './utils/render.js';

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
    render(siteBody, filmDetailsPopup, RenderPosition.BEFOREEND);
    siteBody.classList.add('hide-overflow');
    document.addEventListener('keydown', onEscKeyDown);

    filmDetailsPopup.closePopupHandler(() => {
      removeFilmDetailsPopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });
  };

  const removeFilmDetailsPopup = () => {
    remove(filmDetailsPopup);
    siteBody.classList.remove('hide-overflow');
  };

  render(filmsContainer, filmCard, RenderPosition.BEFOREEND);

  filmCard.renderFilmPopupHandler(() => {
    renderFilmDetailsPopup();
  });
};

const renderFilmExtraCards = (cardsQuantity) => {
  const filmLists = siteMain.querySelectorAll('.films-list--extra');

  filmLists.forEach((filmList) => {
    const filmListContainer = filmList.querySelector('.films-list__container');
    for (let i = 0; i < cardsQuantity; i++) {
      render(filmListContainer, new FilmCardView(filmCards[i]), RenderPosition.BEFOREEND);
    }
  });
};

const filmsSection = new FilmsSectionView();
const filmsList = new FilmsListView();
const showMoreButton = new ShowMoreButtonView();

render(siteHeader, new UserProfileView(), RenderPosition.BEFOREEND);
render(siteMain, new SiteMenuView(filtersValues), RenderPosition.BEFOREEND);
render(siteMain, new SiteSortingView(), RenderPosition.BEFOREEND);
render(siteMain, filmsSection, RenderPosition.BEFOREEND);

if (filmCards.length === 0) {
  render(filmsSection, new NoFilmsView(), RenderPosition.BEFOREEND);
} else {
  render(filmsSection, filmsList, RenderPosition.BEFOREEND);
  const filmsContainer = filmsList.getElement().querySelector('.films-list__container');

  let renderedFilmsCount = 0;
  filmCards
    .slice(renderedFilmsCount, FILMS_RENDERING_STEP)
    .forEach((it) => renderFilmCard(filmsContainer, it));
  renderedFilmsCount += FILMS_RENDERING_STEP;

  if (filmCards.length > FILMS_RENDERING_STEP) {
    render(filmsList, showMoreButton, RenderPosition.BEFOREEND);
    showMoreButton.setClickHandler(() => {
      filmCards
        .slice(renderedFilmsCount, renderedFilmsCount + FILMS_RENDERING_STEP)
        .forEach((it) => renderFilmCard(filmsContainer, it));
      renderedFilmsCount += FILMS_RENDERING_STEP;

      if (filmCards.length <= renderedFilmsCount) {
        remove(showMoreButton);
      }
    });
  }
}

render(filmsSection, new FilmsRatedView(), RenderPosition.BEFOREEND);
render(filmsSection, new FilmsCommentedView(), RenderPosition.BEFOREEND);
renderFilmExtraCards(EXTRA_CARDS_COUNT);
render(footerStatistics, new FilmsQuanityView(filmCards), RenderPosition.BEFOREEND);
