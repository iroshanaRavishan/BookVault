import React, { useEffect, useState } from 'react';
import styles from './bookreadingborad.module.css';
import { useParams } from 'react-router-dom';
import FlipBook from '../flip-bool-method-one/FlipBook';

export default function BookReadingBorad() {
  const { id } = useParams();
  const [bookId, setBookId] = useState('');
  const [bookName, setBookName] = useState('');
  const [bookPdfUrl, setBookPdfUrl] = useState('');
  const [loading, setLoading] = useState(true);

  // Load existing book data
  useEffect(() => {
    const loadBookData = async () => {
      if (!id) {
        setMessage("No book ID provided")
        setLoading(false)
        return
      }
      try {
        const response = await fetch(`https://localhost:7157/api/Books/${id}`)

        if (!response.ok) {
          throw new Error("Failed to load book data")
        }
        const bookData = await response.json();

        console.log(bookData, "bookData");

        // Populate form fields with existing data
        setBookId(bookData.id);
        setBookName(bookData.name || "");

        // Normalize slashes and form the public URL
        const normalizedPath = bookData.pdfFilePath.replace(/\\/g, '/');
        setBookPdfUrl(`https://localhost:7157/uploads/${normalizedPath}`);

        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error("Error loading book:", error)
        setMessage("Failed to load book data")
      }
    }

    loadBookData()
  }, [id])

  return (
    <div className={styles.container}>
      {/* {loading && <p>Loading PDF...</p>}
      {!loading && bookPdfUrl ? (
        <iframe
          src={bookPdfUrl}
          title="PDF Viewer"
          width="100%"
          height="100%"
          className={styles.pdfViewer}
        />
      ) : !loading && (
        <p>PDF not available for this book.</p>
      )} */}
      <FlipBook />
    </div>
  )
}
