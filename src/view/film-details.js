import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import SmartView from './smart.js';
import {
  calculateRuntime
} from '../utils/common.js';

const createCommentsDateTemplate = (date) => {
  dayjs.extend(relativeTime);

  return dayjs(date).fromNow();
};

const createFilmDetailsPopupTemplate = (data) => {
  const {
    name,
    poster,
    rating,
    runtime,
    genres,
    comments,
    originalName,
    producer,
    writers,
    actors,
    date,
    country,
    fullDescription,
    ageRating,
    comment,
    emoji,
    isEmoji,
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

  const generateComments = () => {
    return `${comments.map((it) => `<li class="film-details__comment">
   <span class="film-details__comment-emoji">
     <img src="${it.emoji}" width="55" height="55" alt="emoji-smile">
   </span>
   <div>
     <p class="film-details__comment-text">${it.comment}</p>
     <p class="film-details__comment-info">
       <span class="film-details__comment-author">${it.author}</span>
       <span class="film-details__comment-day">${createCommentsDateTemplate(it.date)}</span>
       <button class="film-details__comment-delete">Delete</button>
     </p>
   </div>
   </li>`).join('')}`;
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
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
        <ul class="film-details__comments-list">
        ${generateComments()}
        </ul>
         <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
          ${isEmoji ? `<img src="images/emoji/${emoji}.png " width="55" height="55" alt="emoji-${emoji}">` : ''}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment}</textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${emoji === 'smile' ? 'checked' : ''}>
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${emoji === 'sleeping' ? 'checked' : ''}>
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${emoji === 'puke' ? 'checked' : ''}>
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${emoji === 'angry' ? 'checked' : ''}>
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class FilmDetailsPopup extends SmartView {
  constructor(filmCard) {
    super();
    this._data = FilmDetailsPopup.parseFilmCardToData(filmCard);
    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
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
    }, true);
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
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentInputHandler);

    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('change', this._emojiChangeHandler);

    this.getElement()
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this._closePopupHandler);
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
      });
  }

  static parseDataToFilmCard(data) {
    data = Object.assign({}, data);

    return data;
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      comment: evt.target.value,
    }, true);
  }

  _emojiChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      emoji: evt.target.value,
      isEmoji: true,
    });
  }
}
