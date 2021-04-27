import {
  render,
  RenderPosition,
  remove
} from '../utils/render.js';

import FilmCardView from '../view/film-card.js';
import FilmDetailsPopupView from '../view/film-details.js';

const siteBody = document.querySelector('body');

const Mode = {
  DEFAULT: 'DEFAULT',
  OPENED: 'OPENED',
};

export default class Film {
  constructor(filmsContainer, changeData, changeMode) {
    this._filmsContainer = filmsContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._filmDetailsPopupComponent = null;
    this._mode = Mode.DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film) {
    this._film = film;
    const filmCardComponent = this._filmCardComponent;
    const filmDetailsPopupComponent = this._filmDetailsPopupComponent;

    this._filmCardComponent = new FilmCardView(film);
    this._filmDetailsPopupComponent = new FilmDetailsPopupView(film);

    this._filmCardComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmCardComponent.setWatchedListClickHandler(this._handleWatchListClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (filmCardComponent === null || filmDetailsPopupComponent === null) {
      render(this._filmsContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
    }

    this._filmCardComponent.renderFilmPopupHandler(() => {
      if (this._mode === Mode.DEFAULT) {
        this._renderFilmDetailsPopup();
      }
    });
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removeFilmDetailsPopup();
    }
  }

  _removeFilmDetailsPopup() {
    remove(this._filmDetailsPopupComponent);
    siteBody.classList.remove('hide-overflow');
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removeFilmDetailsPopup();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _handleWatchListClick() {
    this._changeData(
      Object.assign({},
        this._film, {
          isWatchlist: !this._film.isWatchlist,
        }));
  }

  _handleWatchedClick() {
    this._changeData(
      Object.assign({},
        this._film, {
          isWatched: !this._film.isWatched,
        }));
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign({},
        this._film, {
          isFavorite: !this._film.isFavorite,
        }));
  }

  _renderFilmDetailsPopup() {
    render(siteBody, this._filmDetailsPopupComponent, RenderPosition.BEFOREEND);
    siteBody.classList.add('hide-overflow');
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.OPENED;

    this._filmDetailsPopupComponent.closePopupHandler(() => {
      this._removeFilmDetailsPopup();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    });
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsPopupComponent);
  }
}
