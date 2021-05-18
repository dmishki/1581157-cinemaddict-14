import {
  render,
  RenderPosition,
  remove
} from '../utils/render.js';

import {
  compareDates,
  compareRatings
} from '../utils/common.js';

import {
  filter
} from '../utils/filter.js';

import {
  SortType,
  UpdateType,
  UserAction
} from '../const.js';

import SiteSortingView from '../view/sorting.js';
import FilmsSectionView from '../view/films-section.js';
import NoFilmsView from '../view/no-films.js';
import FilmsListView from '../view/films-list.js';
import FilmsRatedView from '../view/films-rated.js';
import FilmsCommentedView from '../view/films-commented.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmPresenter from './film.js';

const FILMS_RENDERING_STEP = 5;

export default class FilmsList {
  constructor(filmsListContainer, filmsModel, filterModel) {
    this._filmsListContainer = filmsListContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._renderedFilmsCount = FILMS_RENDERING_STEP;
    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsRatedComponent = new FilmsRatedView();
    this._filmsCommentedComponent = new FilmsCommentedView();
    this._noFilmsComponent = new NoFilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsContainerComponent = this._filmsListComponent.getElement().querySelector('.films-list__container');
    this._filmsRatedContainerComponent = this._filmsRatedComponent.getElement().querySelector('.films-list__container');
    this._filmsCommentedContainerComponent = this._filmsCommentedComponent.getElement().querySelector('.films-list__container');
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._filmPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(compareDates);
      case SortType.RATING:
        return filteredFilms.sort(compareRatings);
    }

    return filteredFilms;
  }

  init() {
    this._renderMovies();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SiteSortingView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._filmsListContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsSection() {
    render(this._filmsListContainer, this._filmsSectionComponent, RenderPosition.BEFOREEND);
  }

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModeChange);
    filmPresenter.init(film);

    if (this._filmPresenter[film.id]) {
      this._filmPresenter[film.id].push(filmPresenter);
    } else {
      this._filmPresenter[film.id] = [filmPresenter];
    }
  }

  _renderFilms(films, container) {
    films.forEach((film) => this._renderFilm(container, film));
  }

  _renderFilmsList() {
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, FILMS_RENDERING_STEP));
    this._renderFilms(films, this._filmsContainerComponent);
    this._renderRatedFilms();
    this._renderCommentedFilms();

    if (filmCount > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }
  }

  _renderRatedFilms() {
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(filmCount - 4, filmCount - 2);

    render(this._filmsSectionComponent, this._filmsRatedComponent, RenderPosition.BEFOREEND);
    this._renderFilms(films, this._filmsRatedContainerComponent);
  }

  _renderCommentedFilms() {
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(filmCount - 2, filmCount);

    render(this._filmsSectionComponent, this._filmsCommentedComponent, RenderPosition.BEFOREEND);
    this._renderFilms(films, this._filmsCommentedContainerComponent);
  }

  _renderNoFilms() {
    render(this._filmsSectionComponent, this._noFilmsComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmsCount + FILMS_RENDERING_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmCount);

    this._renderFilms(films, this._filmsContainerComponent);
    this._renderedFilmsCount = newRenderedFilmCount;

    if (filmCount <= this._renderedFilmsCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenters) => presenters.forEach((presenter) => presenter.resetView()));
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_ITEM:
        this._filmsModel.updateItem(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._filmsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._filmsModel.deleteComment(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPresenter[data.id].forEach((presenter) => presenter.init(data));
        break;
      case UpdateType.MINOR:
        this._clearFilmsList();
        this._renderMovies();
        break;
      case UpdateType.MAJOR:
        this._clearFilmsList({
          resetRenderedFilmCount: true,
          resetSortType: true,
        });
        this._renderMovies();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsList({
      resetRenderedFilmCount: true,
    });
    this._renderMovies();
  }

  _clearFilmsList({
    resetRenderedFilmCount = false,
    resetSortType = false,
  } = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach((filmPresenters) => filmPresenters.forEach((filmPresenter) => filmPresenter.destroy()));
    this._filmPresenter = {};

    remove(this._sortComponent);
    remove(this._noFilmsComponent);
    remove(this._showMoreButtonComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmsCount = FILMS_RENDERING_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderMovies() {
    this._renderSort();
    this._renderFilmsSection();
    render(this._filmsSectionComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    if (this._getFilms().length === 0) {
      this._renderNoFilms();
    } else {
      this._renderFilmsList();
    }
  }
}
