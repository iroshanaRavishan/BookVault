using FilmVault.Data;
using FilmVault.DTOs;
using FilmVault.Models;

namespace FilmVault.Services
{
    public class FilmService : IFilmService
    {
        private readonly FilmDbContext _dbContext;
        private readonly ILogger<FilmService> _logger;

        public FilmService(FilmDbContext dbContext, ILogger<FilmService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<FilmDto> CreateFilmAsync(CreateFilmDto command)
        {
            var film = Film.Create(command.Name, command.Genre, command.ReleaseDate, command.Rating);

            await _dbContext.Films.AddAsync(film);
            await _dbContext.SaveChangesAsync();

            return new FilmDto(
               film.Id,
               film.Name,
               film.Genre,
               film.ReleaseDate,
               film.Rating
            );
        }

        public Task DeleteFilmAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<FilmDto>> GetAllFilmsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<FilmDto?> GetFilmByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task UpdateFilmAsync(Guid id, UpdateFilmDto command)
        {
            throw new NotImplementedException();
        }
    }
}
