import AbstractView from './abstract.js';

const createFilmsQuantityTemplate = (filmsList) => {
  return `<p>${filmsList.length} movies inside</p>`;
};

export default class FilmsQuantity extends AbstractView {
  constructor(filmsList) {
    super();
    this._filmsList = filmsList;
  }

  getTemplate() {
    return createFilmsQuantityTemplate(this._filmsList);
  }
}
