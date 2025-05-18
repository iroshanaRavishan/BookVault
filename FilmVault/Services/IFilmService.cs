using FilmVault.DTOs;

namespace FilmVault.Services
{
    public interface IFilmService
    {
        Task<FilmDto> CreateFilmAsync(CreateFilmDto command);
        Task<FilmDto?> GetFilmByIdAsync(Guid id);
        Task<IEnumerable<FilmDto>> GetAllFilmsAsync();
        Task UpdateFilmAsync(Guid id, UpdateFilmDto command);
        Task DeleteFilmAsync(Guid id);
    }
}
