import React, { useEffect } from 'react';
import styles from './bookreadingborad.module.css';
import { useParams } from 'react-router-dom';

export default function BookReadingBorad() {
  const { id } = useParams();
  const [bookId, setBookId] = useState('');
  const [bookName, setBookName] = useState('');
  const [bookPdfUrl, setBookPdfUrl] = useState('');

  useEffect(() => {
    const loadBookData = async () => {
      if (!id) {
        setMessage("No book ID provided")
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
        setBookPdfUrl(bookData.pdfFilePath); // "pdfs\ad94cf9a-c6e0-40fd-a599-ae9ed8e30c4d.pdf"

      } catch (error) {
        console.error("Error loading book:", error)
        setMessage("Failed to load book data")
      }
    }
    
    loadBookData()
  }, [id])

  return (
    <div className={styles.container}>BookReadingBorad - { id } </div>
  )
}
