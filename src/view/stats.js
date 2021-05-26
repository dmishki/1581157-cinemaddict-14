import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import SmartView from './smart.js';

import {
  calculateTotalFilmsStats,
  countFilmsInDateRange
} from '../utils/statistics.js';

import {
  StatsDate
} from '../const.js';

import {
  calculateProfileRank
} from '../utils/common.js';

import {
  FilterType
} from '../const.js';

import {
  filter
} from '../utils/filter.js';

import {
  calculateDurationHours,
  calculateDurationMinutes
} from '../utils/dates.js';

const createStatsTemplate = (filmsList, currentFilterType) => {
  const {
    films,
    dateFrom,
    isStatsHidden,
  } = filmsList;

  const watchedFilms = filter[FilterType.HISTORY](films);
  const filteredFilms = dateFrom > 0 ? countFilmsInDateRange(dateFrom, watchedFilms) : watchedFilms;
  const calculatedInfo = calculateTotalFilmsStats(filteredFilms);

  const {
    totalFilms,
    totalDuration,
    topFilm,
  } = calculatedInfo;

  const durationHours = calculateDurationHours(totalDuration);
  const durationMinutes = calculateDurationMinutes(totalDuration, durationHours);

  return `<section class="statistic ${isStatsHidden ? 'visually-hidden' : ''}">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${calculateProfileRank(filmsList.films)}</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${StatsDate.ALL === currentFilterType ? 'checked' : ''}>
    <label data-type="${StatsDate.ALL}" for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${StatsDate.TODAY === currentFilterType ? 'checked' : ''}>
    <label data-type="${StatsDate.TODAY}"  for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${StatsDate.WEEK === currentFilterType ? 'checked' : ''}>
    <label data-type="${StatsDate.WEEK}" for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${StatsDate.MONTH === currentFilterType ? 'checked' : ''}>
    <label data-type="${StatsDate.MONTH}" for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${StatsDate.YEAR === currentFilterType ? 'checked' : ''}>
    <label data-type="${StatsDate.YEAR}" for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${totalFilms} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${durationHours} <span class="statistic__item-description">h</span> ${durationMinutes} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${totalFilms !== 0 ? topFilm : ''}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`;
};

export default class Stats extends SmartView {
  constructor(filmsModel) {
    super();

    this._filmsModel = filmsModel;

    this._data = {
      films: this._filmsModel.getFilms(),
      dateFrom: 0,
      isStatsHidden: true,
    };

    this._statsFilterClickHandler = this._statsFilterClickHandler.bind(this);
    this._currentFilterType = StatsDate.ALL;

    this._chart = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this.restoreHandlers();
  }

  getTemplate() {
    return createStatsTemplate(this._data, this._currentFilterType);
  }

  _renderChart() {
    if (this._chart !== null) {
      this._chart = null;
    }

    const statisticCtx = this.getElement().querySelector('.statistic__chart');

    this._chart = renderChart(statisticCtx, this._data);
  }

  _handleModelEvent() {
    this._filmsModel.removeObserver(this._handleModelEvent);
    this._data = {
      films: this._filmsModel.getFilms(),
      dateFrom: 0,
      isStatsHidden: true,
    };
    this.updateElement();
  }

  restoreHandlers() {
    this._filmsModel.addObserver(this._handleModelEvent);
    this._renderChart();
    this.getElement().querySelectorAll('.statistic__filters-label')
      .forEach((item) => item.addEventListener('click', this._statsFilterClickHandler));
  }

  setDefaultFilter() {
    this._currentFilterType = StatsDate.ALL;
  }

  setStatsFilterClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._statsFilterClickHandler);
  }

  _statsFilterClickHandler(evt) {
    evt.preventDefault();
    this._currentFilterType = evt.target.dataset.type;
    this.handleStatsFilterClick(this._currentFilterType);
  }

  handleStatsFilterClick(statsDate) {
    switch (statsDate) {
      case StatsDate.ALL:
        this.updateData({
          dateFrom: 0,
          isStatsHidden: false,
        });
        break;
      case StatsDate.TODAY:
        this.updateData({
          dateFrom: 1,
          isStatsHidden: false,
        });
        break;
      case StatsDate.WEEK:
        this.updateData({
          dateFrom: 7,
          isStatsHidden: false,
        });
        break;
      case StatsDate.MONTH:
        this.updateData({
          dateFrom: 30,
          isStatsHidden: false,
        });
        break;
      case StatsDate.YEAR:
        this.updateData({
          dateFrom: 365,
          isStatsHidden: false,
        });
        break;
    }
  }
}

const renderChart = (statisticCtx, filmsList) => {
  const {
    films,
    dateFrom,
  } = filmsList;

  const watchedFilms = filter[FilterType.HISTORY](films);
  const filteredFilms = dateFrom > 0 ? countFilmsInDateRange(dateFrom, watchedFilms) : watchedFilms;
  const stats = calculateTotalFilmsStats(filteredFilms);

  const {
    genres,
    filmsCountList,
  } = stats;

  const BAR_HEIGHT = 50;

  statisticCtx.height = BAR_HEIGHT * genres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genres,
      datasets: [{
        data: filmsCountList,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};
