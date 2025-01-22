let books = [];
const RENDER_EVENT = "render-books";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBookToList();
  });
});

const getCountBook = ({ books }) => {
  let countCompletedBook = 0;
  let countIncompleteBook = 0;

  for (let book of books) {
    if (book.isComplete) {
      countCompletedBook += 1;
    } else {
      countIncompleteBook += 1;
    }
  }

  return {
    countCompletedBook,
    countIncompleteBook,
  };
};

document.addEventListener("DOMContentLoaded", function () {
  const { countCompletedBook, countIncompleteBook } = getCountBook({
    books: books,
  });
  const countCompleteBookElement = document.getElementById("count-complete");
  const countIncompleteBookElement = document.getElementById("count-incomplete");
  countCompleteBookElement.innerText = String(countCompletedBook);
  countIncompleteBookElement.innerText = String(countIncompleteBook);
});

document.addEventListener("DOMContentLoaded", function () {
  const { countCompletedBook, countIncompleteBook } = getCountBook({
    books: books,
  });
  const completedBookshelfList = document.getElementById("completeBookshelfList");
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  if (countCompletedBook < 1) {
    incompleteBookshelfList.innerHTML = `<h3 style="text-align:center; margin-top: 20px;">Tidak ada buku yang sudah selesai!</h3>`;
  }

  if (countIncompleteBook < 1) {
    completedBookshelfList.innerHTML = `<h3 style="text-align:center; margin-top: 20px;">Tidak ada buku yang harus di selesaikan!</h3>`;
  }
});

const addBookToList = () => {
  const generateBookObject = ({ title, writer, year, isComplete }) => {
    return {
      id: new Date().getTime(),
      title: title,
      author: writer,
      year: year,
      isComplete: isComplete,
    };
  };

  const title = document.getElementById("inputBookTitle").value;
  const writer = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const book = generateBookObject({ title, writer, year, isComplete });
  books.push(book);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  document.getElementById("inputBook").reset();
};

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");

  const completeBookshelfList = document.getElementById("completeBookshelfList");

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";
  const createItemBook = (book) => {
    const title = document.createElement("h3");
    title.className = "item-title";
    title.innerText = book.title;
    const writer = document.createElement("p");
    writer.innerText = `Penulis: ${book.author}`;
    const year = document.createElement("p");
    year.innerText = `Tahun: ${book.year}`;

    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(title, writer, year);

    const action = document.createElement("div");
    action.classList.add("action");
    if (!book.isComplete) {
      const trashButton = document.createElement("button");
      trashButton.classList.add("red");

      trashButton.innerText = "Hapus";
      trashButton.title = "Hapus buku ini";
      trashButton.addEventListener("click", function () {
        removeBook(book.id);
      });

      const checkButton = document.createElement("button");
      checkButton.innerText = "Selesaikan";
      checkButton.classList.add("green");
      checkButton.title = "Tandai telah selesai buku ini";
      checkButton.addEventListener("click", function () {
        addBookToCompleted(book.id);
      });
      action.append(checkButton, trashButton);

      container.append(action);
    } else {
      const trashButton = document.createElement("button");
      trashButton.classList.add("red");

      trashButton.innerText = "Hapus";
      trashButton.title = "Hapus buku ini";
      trashButton.addEventListener("click", function () {
        removeBook(book.id);
      });

      const checkButton = document.createElement("button");
      checkButton.classList.add("green");
      checkButton.innerText = "Baca Lagi";
      checkButton.title = "Tandai telah selesai buku ini";
      checkButton.addEventListener("click", function () {
        removeBookToCompleted(book.id);
      });
      action.append(checkButton, trashButton);

      container.append(action);
    }

    return container;
  };

  const { countCompletedBook, countIncompleteBook } = getCountBook({
    books: books,
  });
  const countCompleteBookElement = document.getElementById("count-complete");
  const countIncompleteBookElement = document.getElementById("count-incomplete");
  countCompleteBookElement.innerText = String(countCompletedBook);
  countIncompleteBookElement.innerText = String(countIncompleteBook);

  if (countIncompleteBook < 1) {
    incompleteBookshelfList.innerHTML = `<h3 style="text-align:center; margin-top: 20px;">Tidak ada buku yang sudah selesai!</h3>`;
  }

  if (countCompletedBook < 1) {
    completeBookshelfList.innerHTML = `<h3 style="text-align:center; margin-top: 20px;">Tidak ada buku yang harus di selesaikan!</h3>`;
  }

  books.forEach((book) => {
    const bookItem = createItemBook(book);
    if (book.isComplete) {
      completeBookshelfList.append(bookItem);
    } else {
      incompleteBookshelfList.append(bookItem);
    }
  });
});

function removeBook(bookId) {
  const book = findBookIndex(bookId);

  if (book === -1) return;

  books.splice(book, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function addBookToCompleted(bookId) {
  const book = findBook(bookId);

  if (book == null) return;

  book.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookToCompleted(bookId) {
  const book = findBook(bookId);

  if (book == null) return;

  book.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  openAlert("Perubahan telah disimpan!", {
    duration: 2000,
  });
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function openAlert(message, { duration = 3000 }) {
  const alert = document.getElementById("alert");
  const alertText = document.getElementById("alertText");
  alertText.innerText = message;
  alert.style.display = "block";
  setTimeout(function () {
    alert.style.display = "none";
  }, duration);
}

const searchBookForm = document.getElementById("searchBook");

searchBookForm.addEventListener("submit", function (event) {
  event.preventDefault();
  searchBook();
});

const searchBook = () => {
  const searchInput = document.getElementById("searchBookTitle");
  const bookItems = document.getElementsByClassName("book_item");

  const searchTerm = searchInput.value.toLowerCase();
  for (let i = 0; i < bookItems.length; i++) {
    const itemTitle = bookItems[i].firstElementChild.textContent.toLowerCase().trim();
    if (itemTitle.includes(searchTerm)) {
      bookItems[i].classList.remove("hidden");
    } else {
      bookItems[i].classList.add("hidden");
    }
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const footer = document.querySelector(".footer");
  const year = new Date().getFullYear();

  footer.innerHTML = `Bookshelf Apps &copy; ${year} @ahmaddzidnii`;
});
