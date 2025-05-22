using BookVault.Data;
using BookVault.DTOs;
using BookVault.Models;
using Microsoft.EntityFrameworkCore;

namespace BookVault.Services
{
    public class BookService : IBookService
    {
        private readonly BookDbContext _dbContext;
        private readonly ILogger<BookService> _logger;

        public BookService(BookDbContext dbContext, ILogger<BookService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<BookDto> CreateBookAsync(CreateBookDto command)
        {
            var book = Book.Create(command.Name, command.Genre, command.ReleaseDate, command.Rating);

            await _dbContext.Books.AddAsync(book);
            await _dbContext.SaveChangesAsync();

            return new BookDto(
               book.Id,
               book.Name,
               book.Genre,
               book.ReleaseDate,
               book.Rating
            );
        }

        public async Task DeleteBookAsync(Guid id)
        {
            var bookToDelete = await _dbContext.Books.FindAsync(id);
            if (bookToDelete != null)
            {
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
                    book.Rating
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
                book.Rating
            );
        }

        public async Task UpdateBookAsync(Guid id, UpdateBookDto command)
        {
            var bookToUpdate = await _dbContext.Books.FindAsync(id);
            if (bookToUpdate is null)
                throw new ArgumentNullException($"Invalid Book Id.");
            bookToUpdate.Update(command.Name, command.Genre, command.ReleaseDate, command.Rating);
            await _dbContext.SaveChangesAsync();
        }
    }
}
