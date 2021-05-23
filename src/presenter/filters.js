import {
  render,
  RenderPosition,
  replace,
  remove
} from '../utils/render.js';

import {
  filter
} from '../utils/filter.js';

import {
  FilterType,
  UpdateType
} from '../const.js';

import FiltersView from '../view/filters.js';

export default class Filters {
  constructor(filterContainer, filterModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FiltersView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  removeActiveClass() {
    if (this._filterComponent.getElement().querySelector('.main-navigation__item--active')) {
      this._filterComponent.getElement()
        .querySelector('.main-navigation__item--active')
        .classList.remove('main-navigation__item--active');
    }
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [{
      type: FilterType.ALL,
      name: 'All movies',
      count: filter[FilterType.ALL](films).length,
    },
    {
      type: FilterType.WATCHLIST,
      name: 'Watchlist',
      count: filter[FilterType.WATCHLIST](films).length,
    },
    {
      type: FilterType.HISTORY,
      name: 'History',
      count: filter[FilterType.HISTORY](films).length,
    },
    {
      type: FilterType.FAVORITES,
      name: 'Favorites',
      count: filter[FilterType.FAVORITES](films).length,
    },
    ];
  }
}
