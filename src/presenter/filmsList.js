import {
  render,
  RenderPosition,
  remove
} from '../utils/render.js';

import {
  updateItem
} from '../utils/common.js';

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
  constructor(filmsListContainer) {
    this._filmsListContainer = filmsListContainer;
    this._renderedFilmsCount = FILMS_RENDERING_STEP;
    this._sortComponent = new SiteSortingView();
    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsRatedComponent = new FilmsRatedView();
    this._filmsCommentedComponent = new FilmsCommentedView();
    this._noFilmsComponent = new NoFilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsContainerComponent = this._filmsListComponent.getElement().querySelector('.films-list__container');
    this._filmsRatedContainerComponent = this._filmsRatedComponent.getElement().querySelector('.films-list__container');
    this._filmsCommentedContainerComponent = this._filmsCommentedComponent.getElement().querySelector('.films-list__container');
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._filmPresenter = {};
  }

  init(filmСards) {
    this._filmCards = filmСards.slice();
    this._renderMovies();
  }

  _renderSort() {
    render(this._filmsListContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsSection() {
    render(this._filmsListContainer, this._filmsSectionComponent, RenderPosition.BEFOREEND);
  }

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilms(from, to, container) {
    this._filmCards
      .slice(from, to)
      .forEach((it) => this._renderFilm(container, it));
  }

  _renderFilmsList() {
    render(this._filmsSectionComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
    this._renderFilms(0, this._renderedFilmsCount, this._filmsContainerComponent);

    if (this._filmCards.length > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }
  }

  _renderRatedFilms() {
    render(this._filmsSectionComponent, this._filmsRatedComponent, RenderPosition.BEFOREEND);
    this._renderFilms(11, 13, this._filmsRatedContainerComponent);
  }

  _renderCommentedFilms() {
    render(this._filmsSectionComponent, this._filmsCommentedComponent, RenderPosition.BEFOREEND);
    this._renderFilms(13, 15, this._filmsCommentedContainerComponent);
  }

  _renderNoFilms() {
    render(this._filmsSectionComponent, this._noFilmsComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILMS_RENDERING_STEP, this._filmsContainerComponent);
    this._renderedFilmsCount += FILMS_RENDERING_STEP;

    if (this._filmCards.length <= this._renderedFilmsCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleFilmChange(updatedFilm) {
    this._filmCards = updateItem(this._filmCards, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  _clearFilmsList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmsCount = FILMS_RENDERING_STEP;
    remove(this._showMoreButtonComponent);
  }

  _renderMovies() {
    this._renderSort();
    this._renderFilmsSection();

    if (this._filmCards.length === 0) {
      this._renderNoFilms();
    } else {
      this._renderFilmsList();
      this._renderRatedFilms();
      this._renderCommentedFilms();
    }
  }
}
