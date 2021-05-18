import Observer from '../utils/observer.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }

  updateItem(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addComment(updateType, update) {
    const filmIndex = this._films.findIndex((film) => film.id === update.id);

    this._films[filmIndex].comments = [
      ...this._films[filmIndex].comments,
      update.comment,
    ];

    this._notify(updateType, this._films[filmIndex]);
  }

  deleteComment(updateType, update) {
    const filmIndex = this._films.findIndex((film) => film.id === update.id);
    const commentIndex = this._films[filmIndex].comments.findIndex((comment) => comment.id === update.comment.id);

    if (commentIndex === -1) {
      throw new Error('Can\'t delete unexisting film');
    }

    this._films[filmIndex].comments = [
      ...this._films[filmIndex].comments.slice(0, commentIndex),
      ...this._films[filmIndex].comments.slice(commentIndex + 1),
    ];

    this._notify(updateType, this._films[filmIndex]);
  }
}
