import React, { useState, useEffect } from 'react';
import styles from './editbooks.module.css';
import { useNavigate, useParams } from "react-router-dom";
import { MdClear, MdAdd, MdClose, MdEdit } from "react-icons/md";

export default function EditBooks() {

  const [name, setName] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [existingImageUrl, setExistingImageUrl] = useState("")
  const [year, setYear] = useState("")
  const [read, setRead] = useState(false)
  const [genres, setGenres] = useState([])
  const [genreInput, setGenreInput] = useState("")
  const [author, setAuthor] = useState("")
  const [plot, setPlot] = useState("")
  const [length, setLength] = useState("")
  const [readUrl, setReadUrl] = useState("")
  const [pdfFile, setPdfFile] = useState(null)
  const [existingPdfUrl, setExistingPdfUrl] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [bookId, setBookId] = useState(null)

  const navigate = useNavigate()
  const { id } = useParams() // Get book ID from URL params

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
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear + 1; i >= 1900; i--) {
    years.push(i)
  }

  // Load existing book data
  useEffect(() => {
    const loadBookData = async () => {
      if (!id) {
        setMessage("No book ID provided")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`https://localhost:7157/api/Books/${id}`)

        if (!response.ok) {
          throw new Error("Failed to load book data")
        }

        const bookData = await response.json()

        // Populate form fields with existing data
        setBookId(bookData.id)
        setName(bookData.name || "")
        setAuthor(bookData.author || "")
        setPlot(bookData.plot || "")
        setLength(bookData.length?.toString() || "")
        setRead(bookData.isRead || false)
        setReadUrl(bookData.readUrl || "")
        setGenres(bookData.genres || [])

        // Handle release date
        if (bookData.releaseDate) {
          const releaseYear = new Date(bookData.releaseDate).getFullYear()
          setYear(releaseYear.toString())
        }

        // Handle existing files
        if (bookData.coverImagePath) {
          setExistingImageUrl(`https://localhost:7157/uploads/${bookData.coverImagePath}`)
        }

        if (bookData.pdfFilePath) {
          setExistingPdfUrl(`https://localhost:7157/uploads/${bookData.pdfFilePath}`)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error loading book:", error)
        setMessage("Failed to load book data")
        setIsLoading(false)
      }
    }

    loadBookData()
  }, [id])

  const handleLengthChange = (e) => {
    const value = e.target.value
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setLength(value)
    }
  }

  // Genre chip functions
  const addGenre = (genre) => {
    const trimmedGenre = genre.trim()
    if (trimmedGenre && !genres.includes(trimmedGenre)) {
      setGenres([...genres, trimmedGenre])
    }
    setGenreInput("")
  }

  const removeGenre = (genreToRemove) => {
    setGenres(genres.filter((genre) => genre !== genreToRemove))
  }

  const handleGenreInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addGenre(genreInput)
    } else if (e.key === "Backspace" && genreInput === "" && genres.length > 0) {
      // Remove last genre if backspace is pressed on empty input
      removeGenre(genres[genres.length - 1])
    }
  }

  const handlePredefinedGenreClick = (genre) => {
    addGenre(genre)
  }

  const updateBookAPI = async (bookData) => {
    console.log("Updating book with data:", bookData)
    try {
      const response = await fetch(`https://localhost:7157/api/Books/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      })

      if (!response.ok) {
        const errorData = await response.json()

        let errorMessage = "Failed to update book"

        if (errorData.errors && typeof errorData.errors === "object") {
          // Flatten and join all error messages
          const messages = Object.values(errorData.errors).flat()
          errorMessage = messages.join(" | ")
        } else if (typeof errorData.message === "string") {
          // Use single message
          errorMessage = errorData.message
        }

        throw new Error(errorMessage)
      }

      return response.status === 204 ? { success: true } : await response.json()
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  const handleUpdateBook = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validation
      if (!name.trim()) {
        setMessage("Please enter a book title.")
        setIsSubmitting(false)
        return
      }

      if (!readUrl.trim() && !pdfFile && !existingPdfUrl) {
        setMessage("Please provide either a read online URL or upload a PDF file.")
        setIsSubmitting(false)
        return
      }

      // Prepare update data (JSON format for PUT request)
      const updateData = {
        name: name.trim(),
        genres: genres,
        author: author.trim(),
        plot: plot.trim(),
        length: length ? Number.parseInt(length) : null,
        isRead: read,
        readUrl: readUrl.trim(),
      }

      // Handle release date
      if (year) {
        updateData.releaseDate = new Date(Number.parseInt(year), 0, 1).toISOString()
      }

      // For file uploads, we'd need a separate endpoint or different handling
      // This is a simplified version - you might want to handle file uploads separately

      console.log("Update payload:", updateData)

      const result = await updateBookAPI(updateData)

      setMessage("Book updated successfully!")

      setTimeout(() => {
        setMessage("")
        setIsSubmitting(false)
        navigate("/") // Navigate to books list or book detail page
      }, 1500)
    } catch (error) {
      setMessage(error.message || "Failed to update book. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate("/") // Navigate back to books list
  }

  const removeExistingImage = () => {
    setExistingImageUrl("")
    // You might want to call an API to delete the image from server
  }

  const removeExistingPdf = () => {
    setExistingPdfUrl("")
    // You might want to call an API to delete the PDF from server
  }

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.formCard}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>Loading book data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2 className={styles.pageTitle}>
            <MdEdit className={styles.titleIcon} />
            Update Book
          </h2>
          <p className={styles.subtitle}>Modify the details of your book</p>
        </div>

        {message && (
          <div className={`${styles.messageBox} ${message.includes("success") ? styles.success : styles.error}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleUpdateBook} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="name">
                  Book Title *
                </label>
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
                <label className={styles.label} htmlFor="imageFile">
                  Cover Image
                </label>

                {/* Show existing image if available */}
                {existingImageUrl && !imageFile && (
                  <div className={styles.existingFileContainer}>
                    <div className={styles.existingImagePreview}>
                      <img
                        src={existingImageUrl || "/placeholder.svg"}
                        alt="Current cover"
                        className={styles.existingImage}
                      />
                      <button
                        type="button"
                        className={styles.removeExistingButton}
                        onClick={removeExistingImage}
                        title="Remove current image"
                      >
                        <MdClose />
                      </button>
                    </div>
                    <p className={styles.existingFileText}>Current cover image</p>
                  </div>
                )}

                <div className={styles.fileUpload}>
                  <input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className={styles.fileInput}
                  />
                  <div className={styles.fileInputLabel}>
                    {imageFile ? imageFile.name : existingImageUrl ? "Choose new image file" : "Choose an image file"}
                  </div>
                  <button
                    type="button"
                    className={styles.browseButton}
                    onClick={() => document.getElementById("imageFile").click()}
                  >
                    Browse
                  </button>
                  {imageFile && (
                    <button
                      type="button"
                      className={styles.clearButton}
                      onClick={() => {
                        setImageFile(null)
                        const fileInput = document.getElementById("imageFile")
                        if (fileInput) fileInput.value = ""
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
                      alt="New cover preview"
                      className={styles.previewImage}
                    />
                  </div>
                )}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="year">
                    Publication Year
                  </label>
                  <select id="year" value={year} onChange={(e) => setYear(e.target.value)} className={styles.select}>
                    <option value="">Select Year</option>
                    {years.map((yearOption) => (
                      <option key={yearOption} value={yearOption}>
                        {yearOption}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="length">
                    Number of Pages
                  </label>
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
                <label className={styles.label} htmlFor="author">
                  Author
                </label>
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
                <label className={styles.label} htmlFor="plot">
                  Plot Summary
                </label>
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
              <label className={styles.label} htmlFor="readUrl">
                Read Online URL
              </label>
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
              <label className={styles.label} htmlFor="pdfFile">
                PDF File
              </label>

              {/* Show existing PDF if available */}
              {existingPdfUrl && !pdfFile && (
                <div className={styles.existingFileContainer}>
                  <div className={styles.existingPdfInfo}>
                    <span className={styles.existingFileText}>Current PDF file available</span>
                    <button
                      type="button"
                      className={styles.removeExistingButton}
                      onClick={removeExistingPdf}
                      title="Remove current PDF"
                    >
                      <MdClose />
                    </button>
                  </div>
                </div>
              )}

              <div className={styles.fileUpload}>
                <input
                  id="pdfFile"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className={styles.fileInput}
                />
                <div className={styles.fileInputLabel}>
                  {pdfFile ? pdfFile.name : existingPdfUrl ? "Choose new PDF file" : "Choose a PDF file"}
                </div>
                <button
                  type="button"
                  className={styles.browseButton}
                  onClick={() => document.getElementById("pdfFile").click()}
                >
                  Browse
                </button>
                {pdfFile && (
                  <button
                    type="button"
                    className={styles.clearButton}
                    onClick={() => {
                      setPdfFile(null)
                      const fileInput = document.getElementById("pdfFile")
                      if (fileInput) fileInput.value = ""
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
              <input type="checkbox" checked={read} onChange={() => setRead(!read)} className={styles.checkbox} />
              <span className={styles.checkmark}></span>I have read this book
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
