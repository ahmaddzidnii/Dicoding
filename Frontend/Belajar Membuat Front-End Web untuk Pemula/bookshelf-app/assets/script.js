let books = [];
const RENDER_EVENT = "render-books";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

document.addEventListener("DOMContentLoaded", function () {
  initEventListeners();
  if (isStorageExist()) loadDataFromStorage();
  updateFooterYear();
});

function initEventListeners() {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBookToList();
  });

  document.addEventListener(RENDER_EVENT, renderBooks);
  document.addEventListener(SAVED_EVENT, () =>
    openAlert("Perubahan telah disimpan!", { duration: 2000 })
  );

  const searchBookForm = document.getElementById("searchBook");
  searchBookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchBook();
  });
}

function getCountBook({ books }) {
  let countCompletedBook = 0;
  let countIncompleteBook = 0;

  for (let book of books) {
    book.isComplete ? countCompletedBook++ : countIncompleteBook++;
  }

  return { countCompletedBook, countIncompleteBook };
}

function addBookToList() {
  const book = generateBookObject({
    title: document.getElementById("inputBookTitle").value,
    writer: document.getElementById("inputBookAuthor").value,
    year: document.getElementById("inputBookYear").value,
    isComplete: document.getElementById("inputBookIsComplete").checked,
  });

  books.push(book);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  document.getElementById("inputBook").reset();
}

function generateBookObject({ title, writer, year, isComplete }) {
  return { id: new Date().getTime(), title, author: writer, year, isComplete };
}

function renderBooks() {
  const { countCompletedBook, countIncompleteBook } = getCountBook({ books });
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  const completeBookshelfList = document.getElementById("completeBookshelfList");

  updateBookCount(countCompletedBook, countIncompleteBook);
  displayEmptyMessage(countIncompleteBook, countCompletedBook);

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  books.forEach((book) => {
    const bookItem = createItemBook(book);
    book.isComplete
      ? completeBookshelfList.append(bookItem)
      : incompleteBookshelfList.append(bookItem);
  });
}

function createItemBook(book) {
  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(
    createElement("h3", book.title, "item-title"),
    createElement("p", `Penulis: ${book.author}`),
    createElement("p", `Tahun: ${book.year}`)
  );

  const action = createActionButtons(book);
  container.append(action);

  return container;
}

function createElement(tag, text, className = "") {
  const element = document.createElement(tag);
  element.innerText = text;
  if (className) element.className = className;
  return element;
}

function createActionButtons(book) {
  const action = document.createElement("div");
  action.classList.add("action");

  const trashButton = createActionButton("Hapus", "red", "Hapus buku ini", () =>
    removeBook(book.id)
  );

  const checkButtonText = book.isComplete ? "Baca Lagi" : "Selesaikan";
  const checkButton = createActionButton(
    checkButtonText,
    "green",
    `Tandai ${checkButtonText.toLowerCase()} buku ini`,
    book.isComplete ? () => removeBookToCompleted(book.id) : () => addBookToCompleted(book.id)
  );

  action.append(checkButton, trashButton);
  return action;
}

function createActionButton(text, className, title, eventListener) {
  const button = document.createElement("button");
  button.classList.add(className);
  button.innerText = text;
  button.title = title;
  button.addEventListener("click", eventListener);
  return button;
}

function updateBookCount(countCompletedBook, countIncompleteBook) {
  document.getElementById("count-complete").innerText = countCompletedBook;
  document.getElementById("count-incomplete").innerText = countIncompleteBook;
}

function displayEmptyMessage(countIncompleteBook, countCompletedBook) {
  const completeBookshelfList = document.getElementById("completeBookshelfList");
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");

  if (countIncompleteBook < 1) {
    incompleteBookshelfList.innerHTML = `<h3 style="text-align:center; margin-top: 20px;">Tidak ada buku yang sudah selesai!</h3>`;
  }

  if (countCompletedBook < 1) {
    completeBookshelfList.innerHTML = `<h3 style="text-align:center; margin-top: 20px;">Tidak ada buku yang harus di selesaikan!</h3>`;
  }
}

function removeBook(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function findBookIndex(bookId) {
  return books.findIndex((book) => book.id === bookId);
}

function addBookToCompleted(bookId) {
  const book = findBook(bookId);
  if (book) {
    book.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function removeBookToCompleted(bookId) {
  const book = findBook(bookId);
  if (book) {
    book.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function findBook(bookId) {
  return books.find((book) => book.id === bookId) || null;
}

function saveData() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) {
    books = JSON.parse(serializedData);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function openAlert(message, { duration = 3000 }) {
  const alert = document.getElementById("alert");
  alert.style.display = "block";
  document.getElementById("alertText").innerText = message;
  setTimeout(() => (alert.style.display = "none"), duration);
}

function searchBook() {
  const searchTerm = document.getElementById("searchBookTitle").value.toLowerCase();
  Array.from(document.getElementsByClassName("book_item")).forEach((item) => {
    const title = item.querySelector(".item-title").textContent.toLowerCase();
    item.classList.toggle("hidden", !title.includes(searchTerm));
  });
}

function updateFooterYear() {
  document.querySelector(
    ".footer"
  ).innerHTML = `Bookshelf Apps &copy; ${new Date().getFullYear()} @ahmaddzidnii`;
}
