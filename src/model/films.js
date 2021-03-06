import Observer from '../utils/observer.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
    this._filmsGenres = [];
  }

  getFilms() {
    return this._films;
  }

  setFilms(films, updateType) {
    this._films = films.slice();
    this._notify(updateType);
  }

  setComments(filmId, comments, updateType) {
    const film = this._films.find((item) => item.id === filmId);
    film.internalComments = comments;
    film.comments = comments.map((item) => item.id);
    this._notify(updateType, film);
  }

  getGenres() {
    return this._filmsGenres;
  }

  setGenres(genres) {
    return this._filmsGenres = Array.from(genres);
  }

  updateItem(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    const internalComments = this._films[index].internalComments;
    update.internalComments = internalComments;
    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const filmIndex = this._films.findIndex((film) => film.id === update.id);
    const commentIndex = this._films[filmIndex].internalComments.findIndex((comment) => comment.id === update.comment.id);

    if (commentIndex === -1) {
      throw new Error('Can\'t delete unexisting film');
    }

    this._films[filmIndex].internalComments = [
      ...this._films[filmIndex].internalComments.slice(0, commentIndex),
      ...this._films[filmIndex].internalComments.slice(commentIndex + 1),
    ];

    this._films[filmIndex].comments = this._films[filmIndex].internalComments.map((item) => item.id);

    this._notify(updateType, this._films[filmIndex]);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign({},
      film, {
        name: film.film_info.title,
        originalName: film.film_info.alternative_title,
        poster: film.film_info.poster,
        rating: film.film_info.total_rating,
        date: film.film_info.release.date,
        runtime: film.film_info.runtime,
        genres: film.film_info.genre,
        description: film.film_info.description,
        producer: film.film_info.director,
        writers: film.film_info.writers,
        actors: film.film_info.actors,
        country: film.film_info.release.release_country,
        fullDescription: film.film_info.description,
        ageRating: film.film_info.age_rating,
        comment: '',
        emoji: '',
        isEmoji: false,
        isWatchlist: film.user_details.watchlist,
        isWatched: film.user_details.already_watched,
        isFavorite: film.user_details.favorite,
        watchingDate: film.user_details.watching_date,
      });

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign({},
      film, {
        'film_info': {
          title: film.name,
          'alternative_title': film.originalName,
          poster: film.poster,
          'total_rating': film.rating,
          runtime: film.runtime,
          genre: film.genres,
          description: film.fullDescription,
          director: film.producer,
          writers: film.writers,
          actors: film.actors,
          'age_rating': film.ageRating,
          release: {
            date: film.date,
            'release_country': film.country,
          },
        },
        'user_details': {
          watchlist: film.isWatchlist,
          'already_watched': film.isWatched,
          favorite: film.isFavorite,
          'watching_date': film.watchingDate,
        },
      });

    delete adaptedFilm.comment;
    delete adaptedFilm.emoji;
    delete adaptedFilm.isEmoji;
    delete adaptedFilm.name;
    delete adaptedFilm.originalName;
    delete adaptedFilm.poster;
    delete adaptedFilm.rating;
    delete adaptedFilm.date;
    delete adaptedFilm.runtime;
    delete adaptedFilm.genres;
    delete adaptedFilm.fullDescription;
    delete adaptedFilm.description;
    delete adaptedFilm.producer;
    delete adaptedFilm.writers;
    delete adaptedFilm.actors;
    delete adaptedFilm.country;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.isWatchlist;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.internalComments;
    delete adaptedFilm.isDeleting;

    return adaptedFilm;
  }

  static adaptCommentsToClient(comment) {
    const adaptedComment = Object.assign({},
      comment, {
        emoji: comment.emotion,
      });

    delete adaptedComment.emotion;

    return adaptedComment;
  }

  static adaptCommentsToServer(comments) {
    const adaptedComment = Object.assign({},
      comments.comment, {
        emotion: comments.comment.emoji,
      });

    delete adaptedComment.emoji;

    return adaptedComment;
  }
}
