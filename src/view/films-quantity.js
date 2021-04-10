import {
  createElement
} from './utils.js';

const createFilmsQuanityTemplate = (filmsList) => {
  return `<p>${filmsList.length} movies inside</p>`;
};

export default class FilmsQuanity {
  constructor(filmsList) {
    this._element = null;
    this._filmsList = filmsList;
  }

  getTemplate() {
    return createFilmsQuanityTemplate(this._filmsList);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
