import dayjs from 'dayjs';
import SmartView from './smart.js';
import {
  calculateRuntime
} from '../utils/dates.js';
import {
  render,
  RenderPosition
} from '../utils/render.js';
import CommentsBlockView from './comments.js';

const createFilmDetailsPopupTemplate = (data) => {
  const {
    name,
    poster,
    rating,
    runtime,
    genres,
    originalName,
    producer,
    writers,
    actors,
    date,
    country,
    fullDescription,
    ageRating,
    isWatchlist,
    isWatched,
    isFavorite,
  } = data;

  const generateGenres = () => {
    return `<td class="film-details__term">${genres.length > 1 ? 'Genres' : 'Genre'}</td>
    <td class="film-details__cell">
    ${genres.map((it) => `<span class="film-details__genre">${it}</span>`).join('')}
    </td>`;
  };

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${name}</h3>
              <p class="film-details__title-original">Original: ${originalName}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${producer}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(date).format('DD MMMM YYYY')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${calculateRuntime(runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              ${generateGenres()}
            </tr>
          </table>

          <p class="film-details__film-description">
          ${fullDescription}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchlist ? 'checked' : ''}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? 'checked' : ''}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? 'checked' : ''}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="film-details__bottom-container">

    </div>
  </form>
</section>`;
};

export default class FilmDetailsPopup extends SmartView {
  constructor(filmCard, changeData) {
    super();
    this._data = FilmDetailsPopup.parseFilmCardToData(filmCard);
    this._changeData = changeData;
    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetailsPopupTemplate(this._data);
  }

  _watchListClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isWatchlist: !this._data.isWatchlist,
    });
    this._callback.watchListClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isWatched: !this._data.isWatched,
    });
    this._callback.watchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isFavorite: !this._data.isFavorite,
    });
    this._callback.favoriteClick();
  }

  setWatchListClickHandler(callback) {
    this._callback.watchListClick = callback;
    this.getElement().querySelector('.film-details__control-label--watchlist').addEventListener('click', this._watchListClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-details__control-label--watched').addEventListener('click', this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-details__control-label--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  _closePopupHandler(evt) {
    evt.preventDefault();
    this._callback.closePopup();
  }

  closePopupHandler(callback) {
    this._callback.closePopup = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closePopupHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__control-label--watchlist')
      .addEventListener('click', this._watchListClickHandler);

    this.getElement()
      .querySelector('.film-details__control-label--watched')
      .addEventListener('click', this._watchedClickHandler);

    this.getElement()
      .querySelector('.film-details__control-label--favorite')
      .addEventListener('click', this._favoriteClickHandler);

    this.getElement()
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this._closePopupHandler);

    this.renderCommentsBlock(this._data, this._changeData);
  }

  reset(film) {
    this.updateData(
      FilmDetailsPopup.parseFilmCardToData(film));
  }

  static parseFilmCardToData(film) {
    return Object.assign({},
      film, {
        isWatchlist: film.isWatchlist,
        isWatched: film.isWatched,
        isFavorite: film.isFavorite,
        isAdding: film.isAdding,
        isDeleting: film.isDeleting,
      });
  }

  static parseDataToFilmCard(data) {
    data = Object.assign({}, data);

    return data;
  }

  renderCommentsBlock(data, changeData) {
    const commentsContainer = this.getElement().querySelector('.film-details__bottom-container');
    const commentsBlock = new CommentsBlockView(data, changeData);
    render(commentsContainer, commentsBlock, RenderPosition.BEFOREEND);
  }
}
