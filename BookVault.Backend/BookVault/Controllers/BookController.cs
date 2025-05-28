using BookVault.Application.DTOs;
using BookVault.Application.Services;
using BookVault.DTOs;
using BookVault.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookVault.controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;
        private readonly ILogger<BooksController> _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public BooksController(IBookService bookService, ILogger<BooksController> logger, IWebHostEnvironment webHostEnvironment)
        {
            _bookService = bookService;
            _logger = logger;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<BookDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetAll()
        {
            var books = await _bookService.GetAllBooksAsync();
            return Ok(books);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(BookDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BookDto>> GetById(Guid id)
        {
            var book = await _bookService.GetBookByIdAsync(id);
            if (book is null)
                return NotFound($"Book with id {id} not found.");
            return Ok(book);
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(typeof(BookDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Create([FromForm] CreateBookDto request)
        {
            try
            {
                var createdBook = await _bookService.CreateBookAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = createdBook.Id }, createdBook);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validation error creating book");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating book");
                return StatusCode(500, new { message = "An error occurred while creating the book." });
            }
        }

        [HttpPut("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBookDto dto)
        {
            try
            {
                await _bookService.UpdateBookAsync(id, dto);
                return NoContent();
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogWarning(ex, "Book not found for update: {BookId}", id);
                return NotFound(ex.Message);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validation error updating book: {BookId}", id);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _bookService.DeleteBookAsync(id);
                return NoContent();
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogWarning(ex, "Book not found for deletion: {BookId}", id);
                return NotFound(ex.Message);
            }
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file, [FromForm] string fileType)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            if (string.IsNullOrEmpty(fileType))
                return BadRequest("File type is required");

            // Determine the subfolder based on file type
            string subFolder;
            switch (fileType.ToLower())
            {
                case "image":
                    subFolder = "images";
                    break;
                case "pdf":
                    subFolder = "pdfs";
                    break;
                default:
                    return BadRequest("Invalid file type. Only 'image' and 'pdf' are supported.");
            }

            // Create the full upload path with subfolder
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads", subFolder);

            // Ensure the directory exists
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileExtension = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Return the relative path including the subfolder
                var relativePath = Path.Combine(subFolder, fileName);

                _logger.LogInformation("File uploaded successfully: {FileName} to {SubFolder}", fileName, subFolder);
                return Ok(new { filePath = relativePath });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file: {FileName}", file.FileName);
                return StatusCode(500, "Error uploading file");
            }
        }

        [HttpDelete("delete-file")]
        public async Task<IActionResult> DeleteFile([FromBody] DeleteFileRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.FilePath))
                    return BadRequest("File path is required");

                // Construct the full file path
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", request.FilePath);

                // Check if file exists
                if (System.IO.File.Exists(fullPath))
                {
                    // Delete the file
                    System.IO.File.Delete(fullPath);
                    _logger.LogInformation("File deleted successfully: {FilePath}", request.FilePath);
                    return Ok(new { message = "File deleted successfully" });
                }
                else
                {
                    _logger.LogWarning("File not found: {FilePath}", request.FilePath);
                    return NotFound("File not found");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file: {FilePath}", request.FilePath);
                return StatusCode(500, "Error deleting file");
            }
        }

        // NEW ENDPOINT: Delete file and update database
        [HttpDelete("delete-book-file")]
        public async Task<IActionResult> DeleteBookFile([FromBody] DeleteBookFileRequest request)
        {
            try
            {
                if (request.BookId == Guid.Empty)
                    return BadRequest("Book ID is required");

                if (string.IsNullOrEmpty(request.FilePath))
                    return BadRequest("File path is required");

                if (string.IsNullOrEmpty(request.FileType))
                    return BadRequest("File type is required");

                // Get the book first to verify it exists
                var book = await _bookService.GetBookByIdAsync(request.BookId);
                if (book == null)
                    return NotFound("Book not found");

                // Construct the full file path
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", request.FilePath);

                // Delete the physical file if it exists
                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                    _logger.LogInformation("File deleted successfully: {FilePath}", request.FilePath);
                }

                // Update the database to remove the file path
                var updateDto = new UpdateBookDto
                {
                    Name = book.Name,
                    Genres = book.Genres,
                    Author = book.Author,
                    Plot = book.Plot,
                    Length = book.Length,
                    IsRead = book.IsRead,
                    ReadUrl = book.ReadUrl,
                    ReleaseDate = book.ReleaseDate,
                    CoverImagePath = request.FileType.ToLower() == "image" ?  "" : book.CoverImagePath,
                    PdfFilePath = request.FileType.ToLower() == "pdf" ? "": book.PdfFilePath
                };

                // Update the book in the database
                await _bookService.UpdateBookAsync(request.BookId, updateDto);

                _logger.LogInformation("Book file deleted and database updated: BookId={BookId}, FileType={FileType}", 
                    request.BookId, request.FileType);

                return Ok(new { message = "File deleted and database updated successfully" });
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogWarning(ex, "Book not found for file deletion: {BookId}", request.BookId);
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting book file: BookId={BookId}, FilePath={FilePath}", 
                    request.BookId, request.FilePath);
                return StatusCode(500, "Error deleting file and updating database");
            }
        }

        public class DeleteFileRequest
        {
            public string FilePath { get; set; }
        }

        public class DeleteBookFileRequest
        {
            public Guid BookId { get; set; }
            public string FilePath { get; set; }
            public string FileType { get; set; } // "image" or "pdf"
        }
    }
}
