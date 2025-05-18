using FilmVault.DTOs;

namespace FilmVault.Services
{
    public interface IFilmService
    {
        Task<FilmDto> CreateMovieAsync(CreateFilmDto command);
        Task<FilmDto?> GetMovieByIdAsync(Guid id);
        Task<IEnumerable<FilmDto>> GetAllMoviesAsync();
        Task UpdateMovieAsync(Guid id, UpdateFilmDto command);
        Task DeleteMovieAsync(Guid id);
    }
}
