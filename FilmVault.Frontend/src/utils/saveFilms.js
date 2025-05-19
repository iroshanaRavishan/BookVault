// Util to save films to localStorage
export function saveFilms(films) {
  localStorage.setItem('films', JSON.stringify(films));
}

