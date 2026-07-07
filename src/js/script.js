/* global Handlebars, dataSource, utils */

{
  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      bookList: '.books-list',
    },
    form: {
      filters: '.filters form',
    },
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };

  class BooksList {
    constructor() {
      const thisBooksList = this;

      thisBooksList.initData();
      thisBooksList.getElements();
      thisBooksList.render();
      thisBooksList.initActions();
    }

    initData() {
      const thisBooksList = this;

      thisBooksList.data = dataSource.books;
      thisBooksList.favoriteBooks = [];
      thisBooksList.filters = [];
    }

    getElements() {
      const thisBooksList = this;

      thisBooksList.dom = {};
      thisBooksList.dom.wrapper = document.querySelector(select.containerOf.bookList);
      thisBooksList.dom.filterForm = document.querySelector(select.form.filters);
    }

    render() {
      const thisBooksList = this;

      for (const book of thisBooksList.data) {
        const ratingBgc = thisBooksList.determineRatingBgc(book.rating);
        const ratingWidth = book.rating * 10;

        const generatedHTML = templates.book(Object.assign({}, book, {ratingBgc, ratingWidth}));
        const generatedDOM = utils.createDOMFromHTML(generatedHTML);

        thisBooksList.dom.wrapper.appendChild(generatedDOM);
      }
    }

    initActions() {
      const thisBooksList = this;

      // dwuklik na okładce - dodaje/zdejmuje z ulubionych (event delegation)
      thisBooksList.dom.wrapper.addEventListener('dblclick', function(event) {
        event.preventDefault();

        const bookImage = event.target.closest('.book__image');

        if (!bookImage) {
          return;
        }

        const bookId = bookImage.getAttribute('data-id');

        if (thisBooksList.favoriteBooks.includes(bookId)) {
          bookImage.classList.remove('favorite');
          thisBooksList.favoriteBooks = thisBooksList.favoriteBooks.filter(function(id) {
            return id !== bookId;
          });
        } else {
          bookImage.classList.add('favorite');
          thisBooksList.favoriteBooks.push(bookId);
        }
      });

      // zmiana checkboxa w formularzu filtrów (event delegation)
      thisBooksList.dom.filterForm.addEventListener('click', function(event) {
        const isFilterCheckbox = event.target.tagName === 'INPUT'
          && event.target.type === 'checkbox'
          && event.target.name === 'filter';

        if (!isFilterCheckbox) {
          return;
        }

        if (event.target.checked) {
          thisBooksList.filters.push(event.target.value);
        } else {
          thisBooksList.filters.splice(thisBooksList.filters.indexOf(event.target.value), 1);
        }

        thisBooksList.filterBooks();
      });
    }

    filterBooks() {
      const thisBooksList = this;

      for (const book of thisBooksList.data) {
        let shouldBeHidden = false;

        for (const filter of thisBooksList.filters) {
          if (!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }

        const bookImage = document.querySelector(`.book__image[data-id="${book.id}"]`);

        if (shouldBeHidden) {
          bookImage.classList.add('hidden');
        } else {
          bookImage.classList.remove('hidden');
        }
      }
    }

    determineRatingBgc(rating) {
      if (rating < 6) {
        return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
      } else if (rating <= 8) {
        return 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)';
      } else if (rating <= 9) {
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else {
        return 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)';
      }
    }
  }

  const app = new BooksList(); // eslint-disable-line no-unused-vars
}