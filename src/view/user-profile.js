import Smart from './smart.js';

import {
  calculateProfileRank
} from '../utils/common.js';

const createUserProfileTemplate = (films) => {
  return `<section class="header__profile profile">
  <p class="profile__rating">${calculateProfileRank(films)}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`;
};

export default class UserProfile extends Smart {
  constructor(filmsModel) {
    super();
    this._filmsModel = filmsModel;
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this.restoreHandlers();
  }

  restoreHandlers() {
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  getTemplate() {
    return createUserProfileTemplate(this._filmsModel.getFilms());
  }

  _handleModelEvent() {
    this._filmsModel.removeObserver(this._handleModelEvent);
    this.updateElement();
  }
}
