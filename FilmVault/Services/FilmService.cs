using FilmVault.Data;
using FilmVault.DTOs;
using FilmVault.Models;
using Microsoft.EntityFrameworkCore;

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

        public async Task<IEnumerable<FilmDto>> GetAllFilmsAsync()
        {
            return await _dbContext.Films
                .AsNoTracking()
                .Select(movie => new FilmDto(
                    movie.Id,
                    movie.Name,
                    movie.Genre,
                    movie.ReleaseDate,
                    movie.Rating
                ))
                .ToListAsync();
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
