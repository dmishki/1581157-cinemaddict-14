import AbstractView from './abstract.js';

const createFilmsQuanityTemplate = (filmsList) => {
  return `<p>${filmsList.length} movies inside</p>`;
};

export default class FilmsQuanity extends AbstractView {
  constructor(filmsList) {
    super();
    this._filmsList = filmsList;
  }

  getTemplate() {
    return createFilmsQuanityTemplate(this._filmsList);
  }
}
