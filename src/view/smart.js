import Abstract from './abstract.js';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    const scrollTop = prevElement.scrollTop;
    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();

    if (scrollTop > 0) {
      this.getElement().scrollTo({
        top: scrollTop,
      });
    }
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._data = Object.assign({},
      this._data,
      update);

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }
}
