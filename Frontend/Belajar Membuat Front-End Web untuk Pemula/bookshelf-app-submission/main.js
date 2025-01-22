// Constants
const STORAGE_KEY = "BOOKSHELF_DATA";
const RENDER_EVENT = "RENDER_BOOKSHELF";

// State
let books = [];
let searchQuery = "";

// Storage Functions
function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadBooks() {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData) {
    books = JSON.parse(storedData);
  } else {
    books = [];
  }

  dispatchRenderEvent();
}

// Event Handlers
function initializeApp() {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const closeModalButton = document.getElementById("closeModal");

  searchForm.addEventListener("submit", handleSearch);
  bookForm.addEventListener("submit", handleBookSubmit);
  closeModalButton?.addEventListener("click", closeModal);
  window.addEventListener("click", handleOutsideModalClick);
  document.addEventListener(RENDER_EVENT, renderBookshelf);

  loadBooks();
}

function handleSearch(event) {
  event.preventDefault();
  const searchInput = document.getElementById("searchBookTitle");
  searchQuery = searchInput.value.trim();
  dispatchRenderEvent();
}

function handleBookSubmit(event) {
  event.preventDefault();
  const formData = {
    title: document.getElementById("bookFormTitle").value,
    author: document.getElementById("bookFormAuthor").value,
    year: document.getElementById("bookFormYear").value,
    isComplete: document.getElementById("bookFormIsComplete").checked,
  };

  addBook(formData);
  event.target.reset();
}

function handleOutsideModalClick(event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    closeModal();
  }
}

// Book Operations
function addBook({ title, author, year, isComplete }) {
  const newBook = {
    id: Date.now(),
    title,
    author,
    year: parseInt(year),
    isComplete,
  };

  books.push(newBook);
  saveBooks();
  dispatchRenderEvent();
}

function toggleBookStatus(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooks();
    dispatchRenderEvent();
  }
}

function removeBook(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    saveBooks();
    dispatchRenderEvent();
  }
}

function updateBook(bookId, updates) {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex] = { ...books[bookIndex], ...updates };
    saveBooks();
    dispatchRenderEvent();
  }
}

// UI Components
function createBookElement(book) {
  return `
    <div data-bookid="${book.id}" data-testid="bookItem" class="book-item">
      <h3 data-testid="bookItemTitle" class="book-title">${book.title}</h3>
      <p data-testid="bookItemAuthor" class="book-info">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear" class="book-info">Tahun: ${book.year}</p>
      <div class="button-group">
        <button 
          data-testid="bookItemIsCompleteButton" 
          class="btn-primary"
          onclick="toggleBookStatus(${book.id})"
        >
          ${book.isComplete ? "Belum selesai" : "Selesai dibaca"}
        </button>
        <button 
          data-testid="bookItemDeleteButton" 
          class="btn-danger"
          onclick="removeBook(${book.id})"
        >
          Hapus Buku
        </button>
        <button 
          data-testid="bookItemEditButton" 
          class="btn-secondary"
          onclick="openEditModal(${book.id})"
        >
          Edit Buku
        </button>
      </div>
    </div>
  `;
}

function renderBookshelf() {
  const incompleteSection = document.getElementById("incompleteBookList");
  const completeSection = document.getElementById("completeBookList");

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const incompleteBooks = filteredBooks.filter((book) => !book.isComplete);
  const completeBooks = filteredBooks.filter((book) => book.isComplete);

  renderBookSection(incompleteSection, incompleteBooks, "belum selesai dibaca");
  renderBookSection(completeSection, completeBooks, "sudah selesai dibaca");
}

function renderBookSection(container, books, status) {
  container.innerHTML = books.length
    ? books.map(createBookElement).join("")
    : `<p class="empty-message">Tidak ada buku yang ${status}.</p>`;
}

// Modal Operations
function openModal() {
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function openEditModal(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (!book) return;

  const editForm = document.getElementById("bookFormEdit");

  document.getElementById("bookFormTitleEdit").value = book.title;
  document.getElementById("bookFormAuthorEdit").value = book.author;
  document.getElementById("bookFormYearEdit").value = book.year;

  editForm.onsubmit = (event) => handleEditSubmit(event, book.id);
  openModal();
}

function handleEditSubmit(event, bookId) {
  event.preventDefault();

  const updates = {
    title: document.getElementById("bookFormTitleEdit").value,
    author: document.getElementById("bookFormAuthorEdit").value,
    year: parseInt(document.getElementById("bookFormYearEdit").value),
  };

  updateBook(bookId, updates);
  closeModal();
}

// Utility Functions
function dispatchRenderEvent() {
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Initialize the application
document.addEventListener("DOMContentLoaded", initializeApp);
