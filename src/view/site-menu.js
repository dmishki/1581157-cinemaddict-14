import AbstractView from './abstract.js';
import {
  MenuItem
} from '../const.js';

const createSiteMenuTemplate = () => {

  return `<nav class="main-navigation">

  <a href="#stats" data-type='${MenuItem.STATISTICS}' class="main-navigation__additional">Stats</a>
</nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  show() {
    this.getElement()
      .querySelector('.main-navigation__additional')
      .classList.add('main-navigation__additional--active');
  }

  hide() {
    this.getElement()
      .querySelector('.main-navigation__additional')
      .classList.remove('main-navigation__additional--active');
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.type);
  }
}
