using BookVault.Domain.Interfaces;
using BookVault.Models;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using BookVault.Application.DTOs.BookDTOs;
using BookVault.Application.Interfaces;


namespace BookVault.Application.Services
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _bookRepository;
        private readonly ILogger<BookService> _logger;
        private readonly string _uploadsFolder;


        public BookService(IBookRepository bookRepository, ILogger<BookService> logger, Microsoft.AspNetCore.Hosting.IHostingEnvironment environment)
        {
            _bookRepository = bookRepository;
            _logger = logger;
            _uploadsFolder = Path.Combine(environment.ContentRootPath, "uploads");

            // Ensure uploads directory exists
            Directory.CreateDirectory(_uploadsFolder);
            Directory.CreateDirectory(Path.Combine(_uploadsFolder, "images"));
            Directory.CreateDirectory(Path.Combine(_uploadsFolder, "pdfs"));
        }

        public async Task<IEnumerable<BookDto>> GetAllBooksAsync()
        {
            try
            {
                var books = await _bookRepository.GetAllAsync();

                return books.Select(book => new BookDto(
                    book.Id,
                    book.Name,
                    book.Genres,
                    book.ReleaseDate,
                    book.Author,
                    book.Plot,
                    book.Length,
                    book.IsRead,
                    book.ReadUrl,
                    book.CoverImagePath,
                    book.PdfFilePath,
                    book.Created,
                    book.LastModified
                ));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all books: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<BookDto?> GetBookByIdAsync(Guid id)
        {
            try
            {
                var book = await _bookRepository.GetByIdAsync(id);
                if (book == null)
                    return null;

                return new BookDto(
                    book.Id,
                    book.Name,
                    book.Genres,
                    book.ReleaseDate,
                    book.Author,
                    book.Plot,
                    book.Length,
                    book.IsRead,
                    book.ReadUrl,
                    book.CoverImagePath,
                    book.PdfFilePath,
                    book.Created,
                    book.LastModified
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving book with ID {Id}: {Message}", id, ex.Message);
                throw;
            }
        }

        public async Task<BookDto> CreateBookAsync(CreateBookDto command)
        {
            try
            {
                // Parse year to DateTimeOffset
                DateTimeOffset? releaseDate = null;
                if (!string.IsNullOrEmpty(command.Year) && int.TryParse(command.Year, out int year))
                {
                    releaseDate = new DateTimeOffset(year, 1, 1, 0, 0, 0, TimeSpan.Zero);
                }

                // Parse length to int
                int? length = null;
                if (!string.IsNullOrEmpty(command.Length) && int.TryParse(command.Length, out int pages))
                {
                    length = pages;
                }

                // Parse read status
                bool isRead = command.Read?.ToLower() == "true";

                // Handle file uploads
                string coverImagePath = string.Empty;
                string pdfFilePath = string.Empty;

                if (command.CoverImage != null)
                {
                    coverImagePath = await SaveFileAsync(command.CoverImage, "images");
                }

                if (command.PdfFile != null)
                {
                    pdfFilePath = await SaveFileAsync(command.PdfFile, "pdfs");
                }

                // Create book with genres list
                var book = Book.Create(
                    name: command.Name,
                    genres: command.Genres ?? new List<string>(),
                    releaseDate: releaseDate,
                    author: command.Author ?? string.Empty,
                    plot: command.Plot ?? string.Empty,
                    length: length,
                    isRead: isRead,
                    readUrl: command.ReadUrl ?? string.Empty,
                    coverImagePath: coverImagePath,
                    pdfFilePath: pdfFilePath
                );

                // Fixed: Use AddAsync method instead of calling repository as function
                var createdBook = await _bookRepository.AddAsync(book);
                await _bookRepository.SaveChangesAsync();

                return new BookDto(
                    createdBook.Id,
                    createdBook.Name,
                    createdBook.Genres,
                    createdBook.ReleaseDate,
                    createdBook.Author,
                    createdBook.Plot,
                    createdBook.Length,
                    createdBook.IsRead,
                    createdBook.ReadUrl,
                    createdBook.CoverImagePath,
                    createdBook.PdfFilePath,
                    createdBook.Created,
                    createdBook.LastModified
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating book: {Message}", ex.Message);
                throw;
            }
        }

        public async Task UpdateBookAsync(Guid id, UpdateBookDto command)
        {
            try
            {
                var bookToUpdate = await _bookRepository.GetByIdAsync(id);
                if (bookToUpdate is null)
                    throw new ArgumentNullException($"Invalid Book Id: {id}");

                // Store old file paths to delete if they're being replaced
                string oldCoverImagePath = bookToUpdate.CoverImagePath;
                string oldPdfFilePath = bookToUpdate.PdfFilePath;

                // Update the book
                bookToUpdate.Update(
                    name: command.Name ?? bookToUpdate.Name,
                    genres: command.Genres ?? bookToUpdate.Genres,
                    releaseDate: command.ReleaseDate ?? bookToUpdate.ReleaseDate,
                    author: command.Author ?? bookToUpdate.Author,
                    plot: command.Plot ?? bookToUpdate.Plot,
                    length: command.Length ?? bookToUpdate.Length,
                    isRead: command.IsRead ?? bookToUpdate.IsRead,
                    readUrl: command.ReadUrl,
                    coverImagePath: command.CoverImagePath != null ? command.CoverImagePath : bookToUpdate.CoverImagePath,
                    pdfFilePath: command.PdfFilePath != null ? command.PdfFilePath : bookToUpdate.PdfFilePath
                );

                //await _bookRepository.UpdateAsync(bookToUpdate);
                await _bookRepository.SaveChangesAsync();

                // Delete old files if they were replaced
                if (!string.IsNullOrEmpty(command.CoverImagePath) && command.CoverImagePath != oldCoverImagePath)
                {
                    DeleteFileIfExists(oldCoverImagePath);
                }

                if (!string.IsNullOrEmpty(command.PdfFilePath) && command.PdfFilePath != oldPdfFilePath)
                {
                    DeleteFileIfExists(oldPdfFilePath);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating book with ID {Id}: {Message}", id, ex.Message);
                throw;
            }
        }

        public async Task DeleteBookAsync(Guid id)
        {
            try
            {
                var bookToDelete = await _bookRepository.GetByIdAsync(id);
                if (bookToDelete != null)
                {
                    // Delete associated files
                    if (!string.IsNullOrEmpty(bookToDelete.CoverImagePath))
                    {
                        DeleteFileIfExists(bookToDelete.CoverImagePath);
                    }

                    if (!string.IsNullOrEmpty(bookToDelete.PdfFilePath))
                    {
                        DeleteFileIfExists(bookToDelete.PdfFilePath);
                    }

                    await _bookRepository.DeleteAsync(bookToDelete);
                    await _bookRepository.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting book with ID {Id}: {Message}", id, ex.Message);
                throw;
            }
        }

        private async Task<string> SaveFileAsync(IFormFile file, string folder)
        {
            if (file == null || file.Length == 0)
                return string.Empty;

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(_uploadsFolder, folder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Path.Combine(folder, fileName);
        }

        private void DeleteFileIfExists(string relativePath)
        {
            if (string.IsNullOrEmpty(relativePath))
                return;

            var fullPath = Path.Combine(_uploadsFolder, relativePath);
            if (File.Exists(fullPath))
            {
                try
                {
                    File.Delete(fullPath);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to delete file: {Path}", fullPath);
                }
            }
        }
    }
}