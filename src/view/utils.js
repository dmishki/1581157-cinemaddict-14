import dayjs from 'dayjs';

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (Array) => {
  const randomIndex = getRandomInteger(0, Array.length - 1);
  return Array[randomIndex];
};

const getRandomDate = () => {
  const MAX_YEAR_GAP = 70;
  const MAX_DAY_GAP = 14;

  const yearGap = getRandomInteger(-MAX_YEAR_GAP, 0);
  const dayGap = getRandomInteger(-MAX_DAY_GAP, 0);

  return dayjs().add(yearGap, 'year').add(dayGap, 'day').toDate();
};

const renderElement = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export {
  getRandomInteger,
  getRandomArrayElement,
  getRandomDate,
  RenderPosition,
  renderElement,
  createElement
};
