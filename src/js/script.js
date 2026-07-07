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

  let favoriteBooks = [];
  let filters = [];

  function render() {
    const bookList = document.querySelector(select.containerOf.bookList);

    for (const book of dataSource.books) {
      const generatedHTML = templates.book(book);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);

      bookList.appendChild(generatedDOM);
    }
  }

  function filterBooks() {
    for (const book of dataSource.books) {
      let shouldBeHidden = false;

      for (const filter of filters) {
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

  function initActions() {
    const bookList = document.querySelector(select.containerOf.bookList);

    // Ćwiczenie 4: event delegation na całą listę - dwuklik na okładce dodaje/zdejmuje ulubione.
    bookList.addEventListener('dblclick', function(event) {
      event.preventDefault();

      const bookImage = event.target.closest('.book__image');

      if (!bookImage) {
        return;
      }

      const bookId = bookImage.getAttribute('data-id');

      if (favoriteBooks.includes(bookId)) {
        bookImage.classList.remove('favorite');
        favoriteBooks = favoriteBooks.filter(function(id) {
          return id !== bookId;
        });
      } else {
        bookImage.classList.add('favorite');
        favoriteBooks.push(bookId);
      }
    });

    // Ćwiczenie 5: event delegation na formularz filtrów.
    const filtersForm = document.querySelector(select.form.filters);

    filtersForm.addEventListener('click', function(event) {
      const isFilterCheckbox = event.target.tagName === 'INPUT'
        && event.target.type === 'checkbox'
        && event.target.name === 'filter';

      if (!isFilterCheckbox) {
        return;
      }

      if (event.target.checked) {
        filters.push(event.target.value);
      } else {
        filters.splice(filters.indexOf(event.target.value), 1);
      }

      filterBooks();
    });
  }

  render();
  initActions();
}