// Util to save books to localStorage
export function saveBooks(books) {
  localStorage.setItem('books', JSON.stringify(books));
}

