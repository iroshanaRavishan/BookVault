import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './createbooks.module.css';
import { MdClear, MdAdd, MdClose } from "react-icons/md";

export default function CreateBook() {
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [year, setYear] = useState('');
  const [read, setRead] = useState(false);
  const [genres, setGenres] = useState([]);
  const [genreInput, setGenreInput] = useState('');
  const [author, setAuthor] = useState('');
  const [plot, setPlot] = useState('');
  const [length, setLength] = useState('');
  const [readUrl, setReadUrl] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Predefined genre options
  const predefinedGenres = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Thriller",
    "Romance",
    "Fantasy",
    "Science Fiction",
    "Horror",
    "Biography",
    "History",
    "Self-Help",
    "Business",
    "Health",
    "Travel",
    "Cooking",
    "Art",
    "Poetry",
    "Drama",
    "Adventure",
    "Young Adult",
    "Children",
    "Comedy",
    "Crime",
    "Philosophy",
    "Psychology",
    "Religion",
    "Politics",
    "Technology",
    "Education",
  ]

  // Generate years from 1900 to current year + 1
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear + 1; i >= 1900; i--) {
    years.push(i);
  }

  const handleLengthChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setLength(value);
    }
  }

  // Genre chip functions
  const addGenre = (genre) => {
    const trimmedGenre = genre.trim()
    if (trimmedGenre && !genres.includes(trimmedGenre)) {
      setGenres([...genres, trimmedGenre])
    }
    setGenreInput('')
  }

  const removeGenre = (genreToRemove) => {
    setGenres(genres.filter((genre) => genre !== genreToRemove))
  }

  const handleGenreInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addGenre(genreInput)
    } else if (e.key === "Backspace" && genreInput === '' && genres.length > 0) {
      // Remove last genre if backspace is pressed on empty input
      removeGenre(genres[genres.length - 1])
    }
  }

  const handlePredefinedGenreClick = (genre) => {
    addGenre(genre)
  }

  const createBookAPI = async (bookData) => {
    console.log('Creating book with data:', bookData);
    try {
      const response = await fetch('https://localhost:7157/api/Books', {
        method: 'POST',
        body: bookData, // FormData object
      })

      if (!response.ok) {
        const errorData = await response.json()

        let errorMessage = "Failed to create book"

        if (errorData.errors && typeof errorData.errors === "object") {
          // Flatten and join all error messages
          const messages = Object.values(errorData.errors).flat();
          errorMessage = messages.join(" | ");
        } else if (typeof errorData.message === "string") {
          // Use single message
          errorMessage = errorData.message;
        }

        throw new Error(errorMessage)
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!name.trim()) {
        setMessage('Please enter a book title.');
        setIsSubmitting(false);
        return;
      }

      if (!readUrl.trim() && !pdfFile) {
        setMessage('Please provide either a read online URL or upload a PDF file.');
        setIsSubmitting(false);
        return;
      }

      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', name.trim());
      formData.append('year', year || '');
      formData.append('read', read.toString());

      // Send genres as JSON array
      genres.forEach((genre, index) => {
        formData.append(`genres[${index}]`, genre);
      })

      formData.append('author', author.trim());
      formData.append('plot', plot.trim());
      formData.append('length', length || '');
      formData.append('readUrl', readUrl.trim());

      // Add files if they exist
      if (imageFile) {
        formData.append('coverImage', imageFile);
      }
      
      if (pdfFile) {
        formData.append('pdfFile', pdfFile);
      }

      // Call API
      console.log('FormData payload:');
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const result = await createBookAPI(formData);
      
      setMessage('Book added successfully!');

      // Reset form
      resetForm();

      setTimeout(() => {
        setMessage('');
        setIsSubmitting(false);
        navigate('/'); // Navigate to books list or wherever appropriate
      }, 1500);

    } catch (error) {
      setMessage(error.message || 'Failed to add book. Please try again.');
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setImageFile(null);
    setYear('');
    setRead(false);
    setGenres([]);
    setGenreInput('');
    setAuthor('');
    setPlot('');
    setLength('');
    setReadUrl('');
    setPdfFile(null);

    // Reset file inputs
    const imageInput = document.getElementById('imageFile');
    const pdfInput = document.getElementById('pdfFile');
    if (imageInput) imageInput.value = '';
    if (pdfInput) pdfInput.value = '';
  };

  const handleCancel = () => {
    resetForm();
    navigate('/'); // Navigate back to books list
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2 className={styles.pageTitle}>Add a New Book</h2>
          <p className={styles.subtitle}>Enter the details of the book you want to add to your collection</p>
        </div>

        {message && (
          <div className={`${styles.messageBox} ${message.includes('success') ? styles.success : styles.error}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleAddBook} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="name">Book Title *</label>
                <input 
                  id="name"
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className={styles.input} 
                  placeholder="Enter book title"
                  required 
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="imageFile">Cover Image</label>
                <div className={styles.fileUpload}>
                  <input 
                    id="imageFile"
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImageFile(e.target.files[0])} 
                    className={styles.fileInput}
                  />
                  <div className={styles.fileInputLabel}>
                    {imageFile ? imageFile.name : 'Choose an image file'}
                  </div>
                  <button 
                    type="button" 
                    className={styles.browseButton} 
                    onClick={() => document.getElementById('imageFile').click()}
                  >
                    Browse
                  </button>
                  {imageFile && (
                    <button 
                      type="button" 
                      className={styles.clearButton}
                      onClick={() => {
                        setImageFile(null);
                        const fileInput = document.getElementById('imageFile');
                        if (fileInput) fileInput.value = '';
                      }}
                    >
                      <MdClear />
                    </button>
                  )}
                </div>
                {imageFile && (
                  <div className={styles.imagePreview}>
                    <img 
                      src={URL.createObjectURL(imageFile) || "/placeholder.svg"} 
                      alt="Cover preview" 
                      className={styles.previewImage}
                    />
                  </div>
                )}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="year">Publication Year</label>
                  <select 
                    id="year"
                    value={year} 
                    onChange={(e) => setYear(e.target.value)} 
                    className={styles.select}
                  >
                    <option value="">Select Year</option>
                    {years.map((yearOption) => (
                      <option key={yearOption} value={yearOption}>
                        {yearOption}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="length">Number of Pages</label>
                  <input 
                    id="length"
                    type="text" 
                    value={length} 
                    onChange={handleLengthChange} 
                    className={styles.input} 
                    placeholder="e.g. 320"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="genres">
                  Genres
                </label>

                {/* Selected Genres Chips */}
                <div className={styles.genreChipsContainer}>
                  {genres.map((genre, index) => (
                    <div key={index} className={styles.genreChip}>
                      <span>{genre}</span>
                      <button
                        type="button"
                        onClick={() => removeGenre(genre)}
                        className={styles.genreChipRemove}
                        aria-label={`Remove ${genre}`}
                      >
                        <MdClose size={16} />
                      </button>
                    </div>
                  ))}

                  {/* Input for adding new genres */}
                  <input
                    id="genres"
                    type="text" 
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                    onKeyDown={handleGenreInputKeyPress}
                    className={styles.genreInput}
                    placeholder={genres.length === 0 ? "Type a genre and press Enter" : "Add another genre..."}
                  />

                  {genreInput.trim() && (
                    <button
                      type="button"
                      onClick={() => addGenre(genreInput)}
                      className={styles.addGenreButton}
                      aria-label="Add genre"
                    >
                      <MdAdd size={16} />
                    </button>
                  )}
                </div>

                {/* Predefined Genre Suggestions */}
                <div className={styles.genreSuggestions}>
                  <span className={styles.suggestionsLabel}>Popular genres:</span>
                  <div className={styles.suggestionChips}>
                    {predefinedGenres
                      .filter((genre) => !genres.includes(genre))
                      .slice(0, 8)
                      .map((genre) => (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => handlePredefinedGenreClick(genre)}
                          className={styles.suggestionChip}
                        >
                          {genre}
                        </button>
                      ))}
                  </div>
                </div>

                <span className={styles.helpText}>Type a genre and press Enter, or click on suggestions above</span>
              </div>
            </div>

            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="author">Author</label>
                <input
                  id="author"
                  type="text" 
                  value={author} 
                  onChange={(e) => setAuthor(e.target.value)} 
                  className={styles.input} 
                  placeholder="Author name"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="plot">Plot Summary</label>
                <textarea 
                  id="plot"
                  value={plot} 
                  onChange={(e) => setPlot(e.target.value)} 
                  className={`${styles.input} ${styles.textarea}`} 
                  rows="4"
                  placeholder="Brief description of the book's plot"
                />
              </div>
            </div>
          </div>

          <div className={styles.formDivider}></div>

          <div className={styles.accessSection}>
            <h3 className={styles.sectionTitle}>Book Access (Required) *</h3>
            <p className={styles.sectionSubtitle}>Provide at least one way to access the book</p>
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="readUrl">Read Online URL</label>
              <input 
                id="readUrl"
                type="url" 
                value={readUrl} 
                onChange={(e) => setReadUrl(e.target.value)}
                className={styles.input} 
                placeholder="https://example.com/read-online"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="pdfFile">Upload PDF</label>
              <div className={styles.fileUpload}>
                <input 
                  id="pdfFile"
                  type="file" 
                  accept=".pdf" 
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className={styles.fileInput}
                />
                <div className={styles.fileInputLabel}>
                  {pdfFile ? pdfFile.name : 'Choose a PDF file'}
                </div>
                <button 
                  type="button" 
                  className={styles.browseButton} 
                  onClick={() => document.getElementById('pdfFile').click()}
                >
                  Browse
                </button>
                {pdfFile && (
                  <button 
                    type="button" 
                    className={styles.clearButton}
                    onClick={() => {
                      setPdfFile(null);
                      const fileInput = document.getElementById('pdfFile');
                      if (fileInput) fileInput.value = '';
                    }}
                  >
                    <MdClear />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={styles.checkboxContainer}>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={read} 
                onChange={() => setRead(!read)} 
                className={styles.checkbox}
              />
              <span className={styles.checkmark}></span>
              I have read this book, adding for later reference
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
