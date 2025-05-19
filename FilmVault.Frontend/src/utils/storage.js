
// Util to get films from localStorage
export function getStoredFilms() {
  const films = localStorage.getItem('films');
  return films ? JSON.parse(films) : [];
}