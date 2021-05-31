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
import {
  makeTodayDate
} from '../utils/dates.js';

import FilmCardView from '../view/film-card.js';
import FilmDetailsPopupView from '../view/film-details-popup.js';

const siteBody = document.querySelector('body');

const Mode = {
  DEFAULT: 'DEFAULT',
  OPENED: 'OPENED',
};

export const State = {
  ADDING: 'ADDING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class Film {
  constructor(filmsContainer, changeData, changeMode, modelEvent, api, filmsModel) {
    this._filmsContainer = filmsContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._modelEvent = modelEvent;
    this._api = api;
    this._filmsModel = filmsModel;

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

  setComments(film) {
    return this._api.getComments(film)
      .then((comments) => {
        this._filmsModel.setComments(film.id, comments, UpdateType.PATCH);
        this._filmDetailsPopupComponent.updateElement();
      });
  }

  init(film) {
    this._film = film;
    const prevfilmCardComponent = this._filmCardComponent;
    const prevfilmDetailsPopupComponent = this._filmDetailsPopupComponent;

    this._filmCardComponent = new FilmCardView(film);
    this._filmDetailsPopupComponent = new FilmDetailsPopupView(this._film, this._changeData);

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

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsPopupComponent);
  }

  setViewState(state, comment) {
    const resetFormState = () => {
      this._filmDetailsPopupComponent.updateData({
        isDeleting: false,
      });
    };

    switch (state) {
      case State.ADDING:
        document.querySelector('.film-details__comment-input').disabled = true;
        document.querySelectorAll('.film-details__emoji-item').forEach((emoji) => {
          emoji.disabled = true;
        });
        break;
      case State.DELETING:
        this._filmDetailsPopupComponent.updateData({
          isDeleting: true,
          deletingCommentId: comment.id,
        });
        break;
      case State.ABORTING:
        this._filmDetailsPopupComponent.shake(resetFormState);
        break;
    }
  }

  _renderFilmDetailsPopup() {
    this.setComments(this._film)
      .then(() => {
        render(siteBody, this._filmDetailsPopupComponent, RenderPosition.BEFOREEND);
        siteBody.classList.add('hide-overflow');
        document.addEventListener('keydown', this._escKeyDownHandler);
        this._changeMode();
        this._mode = Mode.OPENED;
      });
  }

  _removeFilmDetailsPopup() {
    this._filmDetailsPopupComponent.reset(this._film);
    this._filmDetailsPopupComponent.getElement().remove();
    siteBody.classList.remove('hide-overflow');
    this._mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._modelEvent(UpdateType.UPDATE);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removeFilmDetailsPopup();
    }
  }

  _handleWatchListClick() {
    const updateType = this._mode === Mode.OPENED ? UpdateType.PATCH : UpdateType.UPDATE;
    this._changeData(
      UserAction.UPDATE_ITEM,
      updateType,
      Object.assign({},
        this._film, {
          isWatchlist: !this._film.isWatchlist,
        }));
  }

  _handleWatchedClick() {
    const updateType = this._mode === Mode.OPENED ? UpdateType.PATCH : UpdateType.UPDATE;
    this._changeData(
      UserAction.UPDATE_ITEM,
      updateType,
      Object.assign({},
        this._film, {
          isWatched: !this._film.isWatched,
          watchingDate: makeTodayDate(),
        }));
  }

  _handleFavoriteClick() {
    const updateType = this._mode === Mode.OPENED ? UpdateType.PATCH : UpdateType.UPDATE;
    this._changeData(
      UserAction.UPDATE_ITEM,
      updateType,
      Object.assign({},
        this._film, {
          isFavorite: !this._film.isFavorite,
        }));
  }
}
