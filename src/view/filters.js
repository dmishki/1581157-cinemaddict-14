import {
  FilterType
} from '../const.js';
import {
  MenuItem
} from '../const.js';
import AbstractView from './abstract.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {
    type,
    name,
    count,
  } = filter;

  return `<a href="#${name.toLowerCase()}" data-type='${MenuItem.FILTERS}' data-filter='${type}' class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">${name}${type === FilterType.ALL ? '' : ` <span class="main-navigation__item-count">${count}</span></a>`}`;
};

const createFiltersTemplate = (filters, currentFilterType) => {
  const filterItem = filters
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<div class="main-navigation__items">
  ${filterItem}
  </div>`;
};

export default class Filters extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelectorAll('a').forEach((f) => {
      f.addEventListener('click', this._filterTypeChangeHandler);
    });
  }
}
