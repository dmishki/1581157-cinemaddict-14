import AbstractView from './abstract.js';

const createFilmsSection = () => {
  return `<section class="films">
</section>`;
};

export default class FilmsSection extends AbstractView {
  getTemplate() {
    return createFilmsSection();
  }
}
