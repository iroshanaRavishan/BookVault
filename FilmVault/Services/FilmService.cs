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

        public async Task<BookDto> CreateMovieAsync(CreateBookDto command)
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

        public Task DeleteMovieAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<BookDto>> GetAllMoviesAsync()
        {
            throw new NotImplementedException();
        }

        public Task<BookDto?> GetMovieByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task UpdateMovieAsync(Guid id, UpdateBookDto command)
        {
            throw new NotImplementedException();
        }
    }
}
