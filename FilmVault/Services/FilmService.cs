using BookVault.Data;
using BookVault.DTOs;
using BookVault.Models;

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

        public Task<IEnumerable<BookDto>> GetAllBooksAsync()
        {
            throw new NotImplementedException();
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
