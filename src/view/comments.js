import dayjs from 'dayjs';
import he from 'he';
import relativeTime from 'dayjs/plugin/relativeTime';
import SmartView from './smart.js';

import {
  nanoid
} from 'nanoid';

import {
  UserAction,
  UpdateType
} from '../const.js';

import {
  getRandomDate
} from '../utils/common.js';

const createCommentsDateTemplate = (date) => {
  dayjs.extend(relativeTime);

  return dayjs(date).fromNow();
};

const createCommentsTemplate = (data) => {
  const {
    comments,
    comment,
    emoji,
    isEmoji,
  } = data;

  const generateComments = () => {
    return `${comments.map((it) => `<li class="film-details__comment">
   <span class="film-details__comment-emoji">
     <img src="./images/emoji/${it.emoji}.png" width="55" height="55" alt="emoji-${it.emoji}">
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

  return `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
    <ul class="film-details__comments-list">
    ${generateComments()}
    </ul>
     <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">
      ${isEmoji ? `<img src="images/emoji/${emoji}.png " width="55" height="55" alt="emoji-${emoji}">` : ''}
      </div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(comment)}</textarea>
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
  </section>`;
};

export default class CommentsBlock extends SmartView {
  constructor(data, changeData) {
    super();
    this._data = data;
    this._comments = data.comments;
    this._changeData = changeData;
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._addCommentHandler = this._addCommentHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createCommentsTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentInputHandler);

    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('change', this._emojiChangeHandler);

    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('keydown', (evt) => this._addCommentHandler(evt, this._data.id));

    this.getElement()
      .querySelectorAll('.film-details__comment-delete')
      .forEach((it, index) => it.addEventListener('click', (evt) => this._deleteClickHandler(evt, index, this._data.id)));
  }

  _deleteClickHandler(evt, index, id) {
    evt.preventDefault();
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH, {
        comment: this._comments[index],
        id,
      });
  }

  _addCommentHandler(evt, id) {
    if (evt.keyCode === 13 && evt.ctrlKey && evt.target.value !== '' && this._data.isEmoji) {
      this._changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH, {
          comment: {
            id: nanoid(),
            emoji: this._data.emoji,
            comment: this._data.comment,
            author: 'Bruce Wilson',
            date: getRandomDate(),
          },
          id,
        });
    }
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