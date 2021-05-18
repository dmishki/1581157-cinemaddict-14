import {
  render,
  RenderPosition,
  remove,
  replace
} from '../utils/render.js';
import {
  UserAction,
  UpdateType
} from '../const.js';

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
    this._handlePopupWatchListClick = this._handleWatchListClick.bind(this);
    this._handlePopupWatchedClick = this._handleWatchedClick.bind(this);
    this._handlePopupFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film) {
    this._film = film;
    const prevfilmCardComponent = this._filmCardComponent;
    const prevfilmDetailsPopupComponent = this._filmDetailsPopupComponent;

    this._filmCardComponent = new FilmCardView(film);
    this._filmDetailsPopupComponent = new FilmDetailsPopupView(film, this._changeData);

    this._filmCardComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmDetailsPopupComponent.setWatchListClickHandler(this._handlePopupWatchListClick);
    this._filmDetailsPopupComponent.setWatchedClickHandler(this._handlePopupWatchedClick);
    this._filmDetailsPopupComponent.setFavoriteClickHandler(this._handlePopupFavoriteClick);

    this._filmCardComponent.renderFilmPopupHandler(() => {
      if (this._mode === Mode.DEFAULT) {
        this._renderFilmDetailsPopup();
      }
    });

    this._filmDetailsPopupComponent.closePopupHandler(() => {
      this._removeFilmDetailsPopup();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    });

    if (prevfilmCardComponent === null || prevfilmDetailsPopupComponent === null) {
      render(this._filmsContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmsContainer.contains(prevfilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevfilmCardComponent);
    }

    if (siteBody.contains(prevfilmDetailsPopupComponent.getElement())) {
      replace(this._filmDetailsPopupComponent, prevfilmDetailsPopupComponent);
    }

    remove(prevfilmCardComponent);
    remove(prevfilmDetailsPopupComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removeFilmDetailsPopup();
    }
  }

  _removeFilmDetailsPopup() {
    this._filmDetailsPopupComponent.reset(this._film);
    this._filmDetailsPopupComponent.getElement().remove();
    siteBody.classList.remove('hide-overflow');
    this._mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removeFilmDetailsPopup();
    }
  }

  _handleWatchListClick() {
    this._changeData(
      UserAction.UPDATE_ITEM,
      UpdateType.PATCH,
      Object.assign({},
        this._film, {
          isWatchlist: !this._film.isWatchlist,
        }));
  }

  _handleWatchedClick() {
    this._changeData(
      UserAction.UPDATE_ITEM,
      UpdateType.PATCH,
      Object.assign({},
        this._film, {
          isWatched: !this._film.isWatched,
        }));
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_ITEM,
      UpdateType.PATCH,
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
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsPopupComponent);
  }
}
