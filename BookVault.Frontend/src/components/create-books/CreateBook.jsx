import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './createbooks.module.css';
import { MdClear, MdAdd, MdClose } from "react-icons/md";
import { GENRE_OPTIONS } from '../../constants/constants';

export default function CreateBook() {
  const [createBookFormData, setCreateBookFormData] = useState({
    name: '',
    imageFile: null,
    year: '',
    read: false,
    genres: [],
    genreInput: '',
    author: '',
    plot: '',
    length: '',
    readUrl: '',
    pdfFile: null,
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Generate years from 1900 to current year + 1
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= 1900; i--) {
    years.push(i);
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setCreateBookFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? checked
        : type === 'file'
          ? files[0]
          : value
    }));
  };

  const handleLengthChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setCreateBookFormData(prev => ({ ...prev, length: value }));
    }
  };

  // Genre chip functions
  const addGenre = (genre) => {
    const trimmedGenre = genre.trim();
    if (trimmedGenre && !createBookFormData.genres.includes(trimmedGenre)) {
      setCreateBookFormData(prev => ({
        ...prev,
        genres: [...prev.genres, trimmedGenre],
        genreInput: '',
      }));
    } else {
      setCreateBookFormData(prev => ({
        ...prev,
        genreInput: '',
      }));
    }
  };

  const removeGenre = (genreToRemove) => {
    setCreateBookFormData(prev => ({
      ...prev,
      genres: prev.genres.filter((genre) => genre !== genreToRemove),
    }));
  };

  const handleGenreInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addGenre(createBookFormData.genreInput);
    } else if (e.key === "Backspace" && createBookFormData.genreInput === '' && createBookFormData.genres.length > 0) {
      // Remove last genre if backspace is pressed on empty input
      removeGenre(createBookFormData.genres[createBookFormData.genres.length - 1]);
    }
  };

  const handlePredefinedGenreClick = (genre) => {
    addGenre(genre)
  }

  const createBookAPI = async (bookData) => {
    console.log('Creating book with data:', bookData);
    try {
      const response = await fetch('https://localhost:7157/api/Books', {
        method: 'POST',
        body: bookData, // payload object
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
      if (!createBookFormData.name.trim()) {
        setMessage('Please enter a book title.');
        setIsSubmitting(false);
        return;
      }

      if (!createBookFormData.readUrl.trim() && !createBookFormData.pdfFile) {
        setMessage('Please provide either a read online URL or upload a PDF file.');
        setIsSubmitting(false);
        return;
      }

      // Create payload for file uploads
      const payload = new FormData();
      
      // Add text fields
      payload.append('name', createBookFormData.name.trim());
      payload.append('year', createBookFormData.year || '');
      payload.append('read', createBookFormData.read.toString());

      // Send genres as JSON array
      createBookFormData.genres.forEach((genre, index) => {
        payload.append(`genres[${index}]`, genre);
      });

      payload.append('author', createBookFormData.author.trim());
      payload.append('plot', createBookFormData.plot.trim());
      payload.append('length', createBookFormData.length || '');
      payload.append('readUrl', createBookFormData.readUrl.trim());

      // Add files if they exist
      if (createBookFormData.imageFile) {
        payload.append('coverImage', createBookFormData.imageFile);
      }

      if (createBookFormData.pdfFile) {
        payload.append('pdfFile', createBookFormData.pdfFile);
      }

      // Call API
      console.log('payload:');
      for (let pair of payload.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const result = await createBookAPI(payload);
      
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
    setCreateBookFormData({
      name: '',
      imageFile: null,
      year: '',
      read: false,
      genres: [],
      genreInput: '',
      author: '',
      plot: '',
      length: '',
      readUrl: '',
      pdfFile: null,
    });

    // Reset file inputs manually
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
                  name="name"
                  type="text" 
                  value={createBookFormData.name} 
                  onChange={handleInputChange}
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
                    name="imageFile"
                    type="file" 
                    accept="image/*" 
                    onChange={handleInputChange}
                    className={styles.fileInput}
                  />
                  <div className={styles.fileInputLabel}>
                    {createBookFormData.imageFile ? createBookFormData.imageFile.name : 'Choose an image file'}
                  </div>
                  <button 
                    type="button" 
                    className={styles.browseButton} 
                    onClick={() => document.getElementById('imageFile').click()}
                  >
                    Browse
                  </button>
                  {createBookFormData.imageFile && (
                    <button 
                      type="button" 
                      className={styles.clearButton}
                      onClick={() => {
                        setCreateBookFormData(prev => ({ ...prev, imageFile: null }));
                        const fileInput = document.getElementById('imageFile');
                        if (fileInput) fileInput.value = '';
                      }}
                    >
                      <MdClear />
                    </button>
                  )}
                </div>
                {createBookFormData.imageFile && (
                  <div className={styles.imagePreview}>
                    <img 
                      src={createBookFormData.imageFile ? URL.createObjectURL(createBookFormData.imageFile) : "/placeholder.svg"} 
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
                    name="year"
                    value={createBookFormData.year} 
                    onChange={handleInputChange}
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
                    name="length"
                    type="text" 
                    value={createBookFormData.length} 
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
                  {createBookFormData.genres.map((genre, index) => (
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
                    name="genres"
                    type="text" 
                    value={createBookFormData.genreInput}
                    onChange={handleInputChange}
                    onKeyDown={handleGenreInputKeyPress}
                    className={styles.genreInput}
                    placeholder={
                      createBookFormData.genres.length === 0
                        ? "Type a genre and press Enter"
                        : "Add another genre..."
                    }
                  />

                  {createBookFormData.genreInput.trim() && (
                    <button
                      type="button"
                      onClick={() => addGenre(createBookFormData.genreInput)}
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
                    {GENRE_OPTIONS
                      .filter((genre) => !createBookFormData.genres.includes(genre))
                      // .slice(0, 8) // limiting number of chips to show  
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
                  name="author"
                  type="text" 
                  value={createBookFormData.author} 
                  onChange={handleInputChange}
                  className={styles.input} 
                  placeholder="Author name"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="plot">Plot Summary</label>
                <textarea 
                  id="plot"
                  name="plot"
                  value={createBookFormData.plot} 
                  onChange={handleInputChange}
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
                name="readUrl"
                type="url" 
                value={createBookFormData.readUrl} 
                onChange={handleInputChange}
                className={styles.input} 
                placeholder="https://example.com/read-online"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="pdfFile">Upload PDF</label>
              <div className={styles.fileUpload}>
                <input 
                  id="pdfFile"
                  name="pdfFile"
                  type="file" 
                  accept=".pdf" 
                  onChange={handleInputChange}
                  className={styles.fileInput}
                />
                <div className={styles.fileInputLabel}>
                  {createBookFormData.pdfFile ? createBookFormData.pdfFile.name : 'Choose a PDF file'}
                </div>
                <button 
                  type="button" 
                  className={styles.browseButton} 
                  onClick={() => document.getElementById('pdfFile').click()}
                >
                  Browse
                </button>
                {createBookFormData.pdfFile && (
                  <button 
                    type="button" 
                    className={styles.clearButton}
                    onClick={() => {
                      setCreateBookFormData(prev => ({ ...prev, pdfFile: null }));
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
                id="read"
                name="read"
                type="checkbox" 
                checked={createBookFormData.read} 
                onChange={handleInputChange}
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
