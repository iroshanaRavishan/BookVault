import { useState, useEffect } from 'react';

export default function useBooks(initialLoad = true) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(initialLoad);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://localhost:7157/api/Books');
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialLoad) {
      fetchBooks();
    }
  }, []);

  return { books, loading, fetchBooks };
}
