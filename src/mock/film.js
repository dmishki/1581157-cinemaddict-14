import {
  getRandomInteger,
  getRandomArrayElement,
  getRandomDate
} from '../utils/common.js';

import {
  nanoid
} from 'nanoid';

const getRandomDescription = () => {
  const MIN_DESCRIPTIONS_QUANTITY = 1;
  const MAX_DESCRIPTIONS_QUANTITY = 5;
  const filmDescription = new Set();

  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];

  const randomCommentsQuantity = getRandomInteger(MIN_DESCRIPTIONS_QUANTITY, MAX_DESCRIPTIONS_QUANTITY);

  for (let i = 0; i < randomCommentsQuantity; i++) {
    const randomIndex = getRandomInteger(0, descriptions.length - 1);
    filmDescription.add(descriptions[randomIndex]);
  }

  return Array.from(filmDescription).join(' ');
};

const reduceDescription = (description) => {
  const MAX_DESCRIPTION_LENGTH = 140;
  const REDUCE_LENGTH_VALUE = 139;

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return description.slice(0, REDUCE_LENGTH_VALUE) + '...';
  } else {
    return description;
  }
};

const getRandomFilmName = () => {
  const filmNames = [
    'sagebrush-trail',
    'santa-claus-conquers-the-martians',
    'the-dance-of-life',
    'the-great-flamarion',
    'the-man-with-the-golden-arm',
  ];

  return getRandomArrayElement(filmNames);
};

const getRandomRating = () => {
  const MAX_RATING_VALUE = 9;
  return getRandomInteger(0, MAX_RATING_VALUE) + '.' + getRandomInteger(0, MAX_RATING_VALUE);
};

const getRandomFilmDuration = () => {
  const MAX_MINUTES_DURATION = 220;
  return getRandomInteger(0, MAX_MINUTES_DURATION);
};

const getRandomFilmGenre = () => {
  const filmGenres = [
    'Action',
    'Comedy',
    'Drama',
    'Fantasy',
    'Horror',
    'Mystery',
    'Romance',
    'Thriller',
  ];

  const genres = new Set();

  const randomGenresQuantity = getRandomInteger(1, filmGenres.length - 1);

  for (let i = 0; i < randomGenresQuantity; i++) {
    genres.add(getRandomArrayElement(filmGenres));
  }

  return Array.from(genres);
};

const getRandomName = () => {
  const names = [
    'Oliver Smith',
    'William Johnson',
    'James Williams',
    'Benjamin Brown',
    'Lucas Jones',
  ];

  return getRandomArrayElement(names);
};

const getRandomNamesList = () => {
  const MIN_NAMES_QUANTITY = 2;
  const MAX_NAMES_QUANTITY = 5;
  const namesList = new Set();
  const randomNamesQuantity = getRandomInteger(MIN_NAMES_QUANTITY, MAX_NAMES_QUANTITY);

  for (let i = 0; i < randomNamesQuantity; i++) {
    namesList.add(getRandomName());
  }

  return Array.from(namesList).join(', ');
};

const getRandomCountry = () => {
  const countries = [
    'USA',
    'Russia',
    'Spain',
    'Germany',
    'France',
  ];

  return getRandomArrayElement(countries);
};

const getAgeRating = () => {
  const ageRatings = [
    '18+',
    '12+',
    '6+',
    '0+',
  ];

  return getRandomArrayElement(ageRatings);
};

const getRandomText = () => {
  const comments = [
    'dictumst quisque sagittis purus sit amet volutpat consequat mauris nunc',
    'ut etiam sit amet nisl purus in mollis nunc sed',
    'imperdiet nulla malesuada pellentesque elit eget gravida cum sociis natoque',
    'congue quisque egestas diam in arcu cursus euismod quis viverra',
    'porttitor lacus luctus accumsan tortor posuere ac ut consequat semper',
  ];

  return getRandomArrayElement(comments);
};

const getRandomEmoji = () => {
  const emoji = [
    'angry',
    'puke',
    'sleeping',
    'smile',
  ];

  return getRandomArrayElement(emoji);
};

const generateRandomComments = () => {
  return {
    id: nanoid(),
    comment: getRandomText(),
    emoji: getRandomEmoji(),
    author: getRandomName(),
    date: getRandomDate(),
  };
};

const generateRandomCommentsSize = () => {
  const COMMENTS_MAX_QUANTITY = 5;
  const commentsList = new Set();
  const commentsQuantity = getRandomInteger(0, COMMENTS_MAX_QUANTITY);

  for (let i = 0; i < commentsQuantity; i++) {
    commentsList.add(generateRandomComments());
  }
  return Array.from(commentsList);
};

const generateFilmCard = () => {
  const filmName = getRandomFilmName();
  const posterUrl = './images/posters/' + filmName + '.jpg';
  const fullDescription = getRandomDescription();

  return {
    id: nanoid(),
    name: filmName,
    poster: posterUrl,
    rating: getRandomRating(),
    date: getRandomDate(),
    runtime: getRandomFilmDuration(),
    genres: getRandomFilmGenre(),
    description: reduceDescription(fullDescription),
    comments: generateRandomCommentsSize(),
    originalName: filmName,
    producer: getRandomName(),
    writers: getRandomNamesList(),
    actors: getRandomNamesList(),
    country: getRandomCountry(),
    fullDescription,
    ageRating: getAgeRating(),
    comment: '',
    emoji: '',
    isEmoji: false,
    isWatchlist: Math.random() > 0.5,
    isWatched: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
  };
};

export {
  generateFilmCard
};
