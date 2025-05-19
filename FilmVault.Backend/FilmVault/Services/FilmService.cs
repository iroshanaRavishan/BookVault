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

        public async Task DeleteFilmAsync(Guid id)
        {
            var filmToDelete = await _dbContext.Films.FindAsync(id);
            if (filmToDelete != null)
            {
                _dbContext.Films.Remove(filmToDelete);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<FilmDto>> GetAllFilmsAsync()
        {
            return await _dbContext.Films
                .AsNoTracking()
                .Select(film => new FilmDto(
                    film.Id,
                    film.Name,
                    film.Genre,
                    film.ReleaseDate,
                    film.Rating
                ))
                .ToListAsync();
        }

        public async Task<FilmDto?> GetFilmByIdAsync(Guid id)
        {
            var film = await _dbContext.Films
                       .AsNoTracking()
                       .FirstOrDefaultAsync(m => m.Id == id);
            if (film == null)
                return null;

            return new FilmDto(
                film.Id,
                film.Name,
                film.Genre,
                film.ReleaseDate,
                film.Rating
            );
        }

        public async Task UpdateFilmAsync(Guid id, UpdateFilmDto command)
        {
            var filmToUpdate = await _dbContext.Films.FindAsync(id);
            if (filmToUpdate is null)
                throw new ArgumentNullException($"Invalid Film Id.");
            filmToUpdate.Update(command.Name, command.Genre, command.ReleaseDate, command.Rating);
            await _dbContext.SaveChangesAsync();
        }
    }
}
