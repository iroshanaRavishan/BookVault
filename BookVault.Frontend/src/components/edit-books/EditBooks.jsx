import { useState, useEffect } from "react"
import styles from "./editbooks.module.css"
import { useNavigate, useParams } from "react-router-dom"
import { MdAdd, MdClose, MdEdit, MdZoomIn, MdDownload, MdDelete } from "react-icons/md"

export default function EditBooks() {
  const [name, setName] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [existingImageUrl, setExistingImageUrl] = useState("")
  const [existingImagePath, setExistingImagePath] = useState("")
  const [removeExistingImage, setRemoveExistingImage] = useState(false)
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
  const [existingPdfPath, setExistingPdfPath] = useState("")
  const [removeExistingPdf, setRemoveExistingPdf] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [bookId, setBookId] = useState(null)
  const [isRemoveImageAtUpdate, setRemoveImageAtUpdate] = useState(false)
  const [isRemovePdfAtUpdate, setRemovePdfAtUpdate] = useState(false)

  // Modal states
  const [showImageModal, setShowImageModal] = useState(false)
  const [modalImageUrl, setModalImageUrl] = useState("")

  const navigate = useNavigate()
  const { id } = useParams()

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
          setExistingImagePath(bookData.coverImagePath)
          setExistingImageUrl(`https://localhost:7157/uploads/${bookData.coverImagePath}`)
        }

        if (bookData.pdfFilePath) {
          setExistingPdfPath(bookData.pdfFilePath)
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

  // Upload file function
  const uploadFile = async (file, fileType) => {
    console.log(`Uploading ${fileType}:`, file.name, file.type, file.size)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("fileType", fileType)

    try {
      const response = await fetch("https://localhost:7157/api/Books/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Upload error response:", errorText)
        throw new Error(`Failed to upload ${fileType}: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      console.log("Upload result:", result)
      return result.filePath
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error)
      throw error
    }
  }

  // Delete file function (only deletes file, not database)
  const deleteFile = async (filePath) => {
    try {
      const response = await fetch(`https://localhost:7157/api/Books/delete-file`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete file")
      }

      return true
    } catch (error) {
      console.error("Error deleting file:", error)
      return false
    }
  }

  // NEW: Delete book file function (deletes file AND updates database)
  const deleteBookFile = async (filePath, fileType) => {
    try {
      const response = await fetch(`https://localhost:7157/api/Books/delete-book-file`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: bookId,
          filePath: filePath,
          fileType: fileType,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete file and update database")
      }

      return true
    } catch (error) {
      console.error("Error deleting book file:", error)
      return false
    }
  }

  // Update book API function
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
        const errorData = await response.text()
        console.error("Update error response:", errorData)

        let errorMessage = "Failed to update book"
        try {
          const parsedError = JSON.parse(errorData)
          if (parsedError.errors && typeof parsedError.errors === "object") {
            const messages = Object.values(parsedError.errors).flat()
            errorMessage = messages.join(" | ")
          } else if (typeof parsedError.message === "string") {
            errorMessage = parsedError.message
          }
        } catch {
          errorMessage = `Failed to update book: ${response.status} ${response.statusText}`
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

      const noReadUrl = !readUrl || readUrl.trim() === "";
      const noPdf = !pdfFile && (!existingPdfUrl || removeExistingPdf);

      if (noReadUrl && noPdf) {
        setMessage("Please provide either a Read Online URL or upload a PDF file.");
        setIsSubmitting(false);
        return;
      }

      // Prepare update data
      const updateData = {
        name: name.trim(),
        genres: genres,
        author: author.trim(),
        plot: plot.trim(),
        length: length ? Number.parseInt(length) : null,
        isRead: read,
        readUrl: readUrl.trim() === "" ? null : readUrl.trim(),
        coverImagePath: null,
        pdfFilePath: null,
      };

      // Handle release date
      if (year) {
        updateData.releaseDate = new Date(Number.parseInt(year), 0, 1).toISOString()
      }

      console.log("Final update payload:", updateData)

      if (imageFile) {
        const imagePath = await uploadFile(imageFile, "image");
        updateData.coverImagePath = imagePath;
        if (existingImagePath) await deleteFile(existingImagePath);
      } else if (removeExistingImage && existingImagePath) {
        updateData.coverImagePath = null;
        await deleteFile(existingImagePath);
      }

      if (pdfFile) {
        const pdfPath = await uploadFile(pdfFile, "pdf");
        updateData.pdfFilePath = pdfPath;
        if (existingPdfPath) await deleteFile(existingPdfPath);
      } else if (removeExistingPdf && existingPdfPath) {
        updateData.pdfFilePath = null;
        await deleteFile(existingPdfPath);
      }

      const result = await updateBookAPI(updateData);

      if (isRemoveImageAtUpdate) {
        // If we are removing the existing image, we need to delete it from the server
        deleteExistingImage();
      }

      if (isRemovePdfAtUpdate) {
        // If we are removing the existing PDF, we need to delete it from the server
        deleteExistingPdf();
      }

      setMessage("Book updated successfully!")

      setTimeout(() => {
        setMessage("")
        setIsSubmitting(false)
        navigate("/") // Navigate to books list or book detail page
      }, 1000)
    } catch (error) {
      console.error("Update error:", error)
      setMessage(error.message || "Failed to update book. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate("/") // Navigate back to books list
  }

  const handleRemoveExistingImage = () => {
    setExistingImageUrl("")
    setRemoveExistingImage(true)
    setRemoveImageAtUpdate(true) // Set flag to indicate image removal
  }

  const handleRemoveExistingPdf = () => {
    setExistingPdfUrl("")
    setRemoveExistingPdf(true)
    setRemovePdfAtUpdate(true) // Set flag to indicate pdf removal
  }

  const handleImageFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log("Image file selected:", file.name, file.type, file.size)
      setImageFile(file)
      setRemoveExistingImage(false)
    }
  }

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log("PDF file selected:", file.name, file.type, file.size)
      setPdfFile(file)
      setRemoveExistingPdf(false)
    }
  }

  const clearImageFile = () => {
    setImageFile(null)
    const fileInput = document.getElementById("imageFile")
    if (fileInput) fileInput.value = ""
  }

  const clearPdfFile = () => {
    setPdfFile(null)
    const fileInput = document.getElementById("pdfFile")
    if (fileInput) fileInput.value = ""
  }

  // Modal functions
  const openImageModal = (imageUrl) => {
    setModalImageUrl(imageUrl)
    setShowImageModal(true)
  }

  const closeImageModal = () => {
    setShowImageModal(false)
    setModalImageUrl("")
  }

  // Download PDF function
  const downloadPdf = (pdfUrl) => {
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = pdfUrl.split("/").pop() || "book.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Delete uploaded file functions (immediately delete from server)
  const deleteUploadedImage = async () => {
    if (imageFile) {
      clearImageFile()
      setMessage("New image file removed.")
    }
  }

  const deleteUploadedPdf = async () => {
    if (pdfFile) {
      clearPdfFile()
      setMessage("New PDF file removed.")
    }
  }

  // UPDATED: Delete existing files from server AND database
  const deleteExistingImage = async () => {
    if (existingImagePath) {
      const success = await deleteBookFile(existingImagePath, "image")
      if (success) {
        setExistingImageUrl("")
        setExistingImagePath("")
        setRemoveExistingImage(true)
        setMessage("Existing image deleted successfully from server and database.")
      } else {
        setMessage("Failed to delete existing image.")
      }
    }
  }

  const deleteExistingPdf = async () => {
    if (existingPdfPath) {
      const success = await deleteBookFile(existingPdfPath, "pdf")
      if (success) {
        setExistingPdfUrl("")
        setExistingPdfPath("")
        setRemoveExistingPdf(true)
        setMessage("Existing PDF deleted successfully from server and database.")
      } else {
        setMessage("Failed to delete existing PDF.")
      }
    }
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

                {/* Show existing image if available and not being removed */}
                {existingImageUrl && !imageFile && !removeExistingImage && (
                  <div className={styles.existingFileContainer}>
                    <div className={styles.existingImagePreview}>
                      <img
                        src={existingImageUrl || "/placeholder.svg"}
                        alt="Current cover"
                        className={styles.existingImage}
                        onClick={() => openImageModal(existingImageUrl)}
                      />
                      <div className={styles.imageActions}>
                        <button
                          type="button"
                          className={styles.actionButton}
                          onClick={() => openImageModal(existingImageUrl)}
                          title="View larger"
                        >
                          <MdZoomIn />
                        </button>
                        <button
                          type="button"
                          className={styles.removeExistingButton}
                          onClick={handleRemoveExistingImage}
                          title="Remove current Image"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                    <p className={styles.existingFileText}>Current cover image</p>
                  </div>
                )}

                <div className={styles.fileUpload}>
                  <input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className={styles.fileInput}
                  />
                  <div className={styles.fileInputLabel}>
                    {imageFile
                      ? imageFile.name
                      : existingImageUrl && !removeExistingImage
                        ? "Choose new image file"
                        : "Choose an image file"}
                  </div>
                  <button
                    type="button"
                    className={styles.browseButton}
                    onClick={() => document.getElementById("imageFile").click()}
                  >
                    Browse
                  </button>
                  {imageFile && (
                    <button type="button" className={styles.deleteButton} onClick={deleteUploadedImage}>
                      <MdClose />
                    </button>
                  )}
                </div>

                {imageFile && (
                  <div className={styles.imagePreview}>
                    <img
                      src={URL.createObjectURL(imageFile) || "/placeholder.svg"}
                      alt="New cover preview"
                      className={styles.previewImage}
                      onClick={() => openImageModal(URL.createObjectURL(imageFile))}
                    />
                    <button
                      type="button"
                      className={styles.previewZoomButton}
                      onClick={() => openImageModal(URL.createObjectURL(imageFile))}
                      title="View larger"
                    >
                      <MdZoomIn />
                    </button>
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

              {/* Show existing PDF if available and not being removed */}
              {existingPdfUrl && !pdfFile && !removeExistingPdf && (
                <div className={styles.existingFileContainer}>
                  <div className={styles.existingPdfInfo}>
                    <span className={styles.existingFileText}>Current PDF file available</span>
                    <div className={styles.pdfActions}>
                      <button
                        type="button"
                        className={styles.actionButton}
                        onClick={() => downloadPdf(existingPdfUrl)}
                        title="Download PDF"
                      >
                        <MdDownload />
                      </button>
                      <button
                        type="button"
                        className={styles.removeExistingButton}
                        onClick={handleRemoveExistingPdf}
                        title="Remove current PDF"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.fileUpload}>
                <input
                  id="pdfFile"
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfFileChange}
                  className={styles.fileInput}
                />
                <div className={styles.fileInputLabel}>
                  {pdfFile
                    ? pdfFile.name
                    : existingPdfUrl && !removeExistingPdf
                      ? "Choose new PDF file"
                      : "Choose a PDF file"}
                </div>
                <button
                  type="button"
                  className={styles.browseButton}
                  onClick={() => document.getElementById("pdfFile").click()}
                >
                  Browse
                </button>
                {pdfFile && (
                  <button type="button" className={styles.deleteButton} onClick={deleteUploadedPdf}>
                    <MdClose />
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

      {/* Image Modal */}
      {showImageModal && (
        <div className={styles.modal} onClick={closeImageModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeImageModal}>
              <MdClose />
            </button>
            <img src={modalImageUrl || "/placeholder.svg"} alt="Large view" className={styles.modalImage} />
          </div>
        </div>
      )}
    </div>
  )
}
