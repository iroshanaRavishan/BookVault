using BookVault.DTOs;

namespace BookVault.Services
{
    public interface IBookService
    {
        Task<BookDto> CreateMovieAsync(CreateBookDto command);
        Task<BookDto?> GetMovieByIdAsync(Guid id);
        Task<IEnumerable<BookDto>> GetAllMoviesAsync();
        Task UpdateMovieAsync(Guid id, UpdateBookDto command);
        Task DeleteMovieAsync(Guid id);
    }
}
