using BookVault.Data;
using BookVault.Domain.Interfaces;
using BookVault.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BookVault.Infrastructure.Repositories
{
    public class BookRepository : IBookRepository
    {
        private readonly BookDbContext _dbContext;
        private readonly ILogger<BookRepository> _logger;

        public BookRepository(BookDbContext dbContext, ILogger<BookRepository> logger)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<Book> AddAsync(Book book)
        {
            try
            {
                await _dbContext.Books.AddAsync(book);
                return book;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding book: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<IEnumerable<Book>> AddRangeAsync(IEnumerable<Book> books)
        {
            try
            {
                await _dbContext.Books.AddRangeAsync(books);
                return books;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding multiple books: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<int> CountAsync()
        {
            try
            {
                return await _dbContext.Books.CountAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error counting books: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            try
            {
                var book = await _dbContext.Books.FindAsync(id);
                if (book == null)
                    return false;

                _dbContext.Books.Remove(book);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting book with ID {Id}: {Message}", id, ex.Message);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(Book book)
        {
            try
            {
                if (book == null)
                    return false;

                _dbContext.Books.Remove(book);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting book: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<bool> DeleteRangeAsync(IEnumerable<Guid> ids)
        {
            try
            {
                var books = await _dbContext.Books
                    .Where(b => ids.Contains(b.Id))
                    .ToListAsync();

                if (!books.Any())
                    return false;

                _dbContext.Books.RemoveRange(books);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting multiple books: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            try
            {
                return await _dbContext.Books.AnyAsync(b => b.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking if book exists with ID {Id}: {Message}", id, ex.Message);
                throw;
            }
        }

        public async Task<IEnumerable<Book>> GetAllAsync()
        {
            try
            {
                return await _dbContext.Books
                    .AsNoTracking()
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all books: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<Book?> GetByIdAsync(Guid id)
        {
            try
            {
                return await _dbContext.Books
                   .FindAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving book with ID {Id}: {Message}", id, ex.Message);
                throw;
            }
        }

        public async Task<IEnumerable<Book>> GetByTitleAsync(string title)
        {
            try
            {
                return await _dbContext.Books
                    .AsNoTracking()
                    .Where(b => b.Name.Contains(title))
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving books with title containing '{Title}': {Message}", title, ex.Message);
                throw;
            }
        }

        public async Task<IEnumerable<Book>> GetByAuthorAsync(string author)
        {
            try
            {
                return await _dbContext.Books
                    .AsNoTracking()
                    .Where(b => b.Author.Contains(author))
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving books by author '{Author}': {Message}", author, ex.Message);
                throw;
            }
        }

        public async Task<IEnumerable<Book>> GetPagedAsync(int pageNumber, int pageSize)
        {
            try
            {
                return await _dbContext.Books
                    .AsNoTracking()
                    .OrderBy(b => b.Name)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving paged books (page {Page}, size {Size}): {Message}",
                    pageNumber, pageSize, ex.Message);
                throw;
            }
        }

        public async Task<IEnumerable<Book>> GetFilteredAsync(
            string? title = null,
            string? author = null,
            DateTime? publishedAfter = null,
            DateTime? publishedBefore = null)
        {
            try
            {
                var query = _dbContext.Books.AsNoTracking();

                if (!string.IsNullOrEmpty(title))
                    query = query.Where(b => b.Name.Contains(title));

                if (!string.IsNullOrEmpty(author))
                    query = query.Where(b => b.Author.Contains(author));

                if (publishedAfter.HasValue)
                    query = query.Where(b => b.ReleaseDate >= publishedAfter.Value);

                if (publishedBefore.HasValue)
                    query = query.Where(b => b.ReleaseDate <= publishedBefore.Value);

                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving filtered books: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<IEnumerable<Book>> SearchAsync(string searchTerm)
        {
            try
            {
                if (string.IsNullOrEmpty(searchTerm))
                    return await GetAllAsync();

                return await _dbContext.Books
                    .AsNoTracking()
                    .Where(b =>
                        b.Name.Contains(searchTerm) ||
                        b.Author.Contains(searchTerm) ||
                        b.Plot.Contains(searchTerm))
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching for books with term '{Term}': {Message}",
                    searchTerm, ex.Message);
                throw;
            }
        }

        public async Task<int> SaveChangesAsync()
        {
            try
            {
                return await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving changes to database: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<Book> UpdateAsync(Book book)
        {
            try
            {
                _dbContext.Entry(book).State = EntityState.Modified;
                return book;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating book with ID {Id}: {Message}", book.Id, ex.Message);
                throw;
            }
        }

        Task<Book?> IBookRepository.GetByTitleAsync(string title)
        {
            throw new NotImplementedException();
        }
    }
}