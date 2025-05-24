using BookVault.Data;
using BookVault.DTOs;
using BookVault.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;

namespace BookVault.Services
{
    public class BookService : IBookService
    {
        private readonly BookDbContext _dbContext;
        private readonly ILogger<BookService> _logger;
        private readonly string _uploadsFolder;

        public BookService(BookDbContext dbContext, ILogger<BookService> logger, IWebHostEnvironment environment)
        {
            _dbContext = dbContext;
            _logger = logger;
            _uploadsFolder = Path.Combine(environment.ContentRootPath, "uploads");

            // Ensure uploads directory exists
            Directory.CreateDirectory(_uploadsFolder);
            Directory.CreateDirectory(Path.Combine(_uploadsFolder, "images"));
            Directory.CreateDirectory(Path.Combine(_uploadsFolder, "pdfs"));
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

                // Create book
                var book = Book.Create(
                    name: command.Name,
                    genre: command.Genres ?? string.Empty,
                    releaseDate: releaseDate,
                    author: command.Author ?? string.Empty,
                    plot: command.Plot ?? string.Empty,
                    length: length,
                    isRead: isRead,
                    readUrl: command.ReadUrl ?? string.Empty,
                    coverImagePath: coverImagePath,
                    pdfFilePath: pdfFilePath
                );

                await _dbContext.Books.AddAsync(book);
                await _dbContext.SaveChangesAsync();

                return new BookDto(
                    book.Id,
                    book.Name,
                    book.Genre,
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
                _logger.LogError(ex, "Error creating book: {Message}", ex.Message);
                throw;
            }
        }

        public async Task DeleteBookAsync(Guid id)
        {
            var bookToDelete = await _dbContext.Books.FindAsync(id);
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

                _dbContext.Books.Remove(bookToDelete);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<BookDto>> GetAllBooksAsync()
        {
            return await _dbContext.Books
                .AsNoTracking()
                .Select(book => new BookDto(
                    book.Id,
                    book.Name,
                    book.Genre,
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
                ))
                .ToListAsync();
        }

        public async Task<BookDto?> GetBookByIdAsync(Guid id)
        {
            var book = await _dbContext.Books
                       .AsNoTracking()
                       .FirstOrDefaultAsync(m => m.Id == id);
            if (book == null)
                return null;

            return new BookDto(
                book.Id,
                book.Name,
                book.Genre,
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

        public async Task UpdateBookAsync(Guid id, UpdateBookDto command)
        {
            var bookToUpdate = await _dbContext.Books.FindAsync(id);
            if (bookToUpdate is null)
                throw new ArgumentNullException($"Invalid Book Id.");

            // Store old file paths to delete if they're being replaced
            string oldCoverImagePath = bookToUpdate.CoverImagePath;
            string oldPdfFilePath = bookToUpdate.PdfFilePath;

            // Update the book
            bookToUpdate.Update(
                name: command.Name ?? bookToUpdate.Name,
                genre: command.Genre ?? bookToUpdate.Genre,
                releaseDate: command.ReleaseDate ?? bookToUpdate.ReleaseDate,
                author: command.Author ?? bookToUpdate.Author,
                plot: command.Plot ?? bookToUpdate.Plot,
                length: command.Length ?? bookToUpdate.Length,
                isRead: command.IsRead ?? bookToUpdate.IsRead,
                readUrl: command.ReadUrl ?? bookToUpdate.ReadUrl,
                coverImagePath: command.CoverImagePath ?? bookToUpdate.CoverImagePath,
                pdfFilePath: command.PdfFilePath ?? bookToUpdate.PdfFilePath
            );

            await _dbContext.SaveChangesAsync();

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