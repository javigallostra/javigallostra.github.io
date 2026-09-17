(function () {
  'use strict';

  var table = document.getElementById('books-table');
  if (!table) { return; }

  var tbody = table.tBodies[0];
  var head = table.tHead;
  var search = document.getElementById('book-search');
  var categorySelect = document.getElementById('book-category');
  var emptyState = document.getElementById('books-empty');

  // Each book occupies two consecutive rows: the data row and its notes row.
  // Pairing them means a sort can move both together.
  var books = [];
  for (var i = 0; i < tbody.rows.length; i++) {
    var row = tbody.rows[i];
    if (row.className.indexOf('book-row') !== -1) {
      books.push({
        row: row,
        notes: row.nextElementSibling,
        toggle: row.querySelector('.notes-toggle')
      });
    }
  }

  function setExpanded(book, expanded) {
    book.notes.hidden = !expanded;
    book.toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }

  // Notes are served expanded so the page is complete without JavaScript.
  // Now that a toggle exists, collapse them.
  books.forEach(function (book) { setExpanded(book, false); });
  table.className += ' js-enhanced';

  tbody.addEventListener('click', function (event) {
    var clicked = event.target.closest('.book-row');
    if (!clicked) { return; }
    // A single handler on the row: a click on the inner button bubbles up to
    // here, so keyboard activation toggles exactly once rather than twice.
    var book = books.filter(function (b) { return b.row === clicked; })[0];
    if (book) { setExpanded(book, book.notes.hidden); }
  });

  var sortKey = 'finished';
  var sortDir = -1; // 1 ascending, -1 descending

  function valueOf(book, key) {
    var raw = book.row.getAttribute('data-' + key) || '';
    return key === 'rating' ? parseInt(raw, 10) : raw;
  }

  function sortBy(key) {
    if (key === sortKey) {
      sortDir = -sortDir;
    } else {
      // Dates and ratings are most useful highest-first; text is not.
      sortDir = (key === 'finished' || key === 'rating') ? -1 : 1;
      sortKey = key;
    }

    books.slice().sort(function (a, b) {
      var av = valueOf(a, sortKey);
      var bv = valueOf(b, sortKey);
      if (av < bv) { return -sortDir; }
      if (av > bv) { return sortDir; }
      return 0;
    }).forEach(function (book) {
      tbody.appendChild(book.row);
      tbody.appendChild(book.notes);
    });

    var headers = head.querySelectorAll('th[data-sort]');
    for (var j = 0; j < headers.length; j++) {
      if (headers[j].getAttribute('data-sort') === sortKey) {
        headers[j].setAttribute('aria-sort', sortDir === 1 ? 'ascending' : 'descending');
      } else {
        headers[j].removeAttribute('aria-sort');
      }
    }
  }

  head.addEventListener('click', function (event) {
    var th = event.target.closest('th[data-sort]');
    if (th) { sortBy(th.getAttribute('data-sort')); }
  });

  function applyFilters() {
    var query = search ? search.value.trim().toLowerCase() : '';
    var category = categorySelect ? categorySelect.value : '';
    var visible = 0;

    books.forEach(function (book) {
      var matchesQuery = !query ||
        book.row.getAttribute('data-title').indexOf(query) !== -1 ||
        book.row.getAttribute('data-author').indexOf(query) !== -1;

      // Pipe-delimited so category names containing spaces still match exactly.
      var cats = book.row.getAttribute('data-categories').split('|');
      var matchesCategory = !category || cats.indexOf(category) !== -1;

      var show = matchesQuery && matchesCategory;
      book.row.hidden = !show;
      if (show) {
        visible++;
      } else {
        setExpanded(book, false);
      }
    });

    if (emptyState) { emptyState.hidden = visible !== 0; }
  }

  if (search) { search.addEventListener('input', applyFilters); }
  if (categorySelect) { categorySelect.addEventListener('change', applyFilters); }
})();
