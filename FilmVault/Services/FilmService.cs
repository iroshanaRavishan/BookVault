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

        public Task DeleteBookAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<BookDto>> GetAllBooksAsync()
        {
            return await _dbContext.Books
                .AsNoTracking()
                .Select(movie => new BookDto(
                    movie.Id,
                    movie.Name,
                    movie.Genre,
                    movie.ReleaseDate,
                    movie.Rating
                ))
                .ToListAsync();
        }

        public Task<BookDto?> GetBookByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task UpdateBookAsync(Guid id, UpdateBookDto command)
        {
            throw new NotImplementedException();
        }
    }
}
