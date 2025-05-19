
// Util to get books from localStorage
export function getStoredBooks() {
  const books = localStorage.getItem('books');
  return books ? JSON.parse(books) : [];
}