using FilmVault.DTOs;
using FilmVault.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FilmVault.controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilmsController : ControllerBase
    {
        private readonly IFilmService _filmService;
        private readonly ILogger<FilmsController> _logger;

        public FilmsController(IFilmService filmService, ILogger<FilmsController> logger)
        {
            _filmService = filmService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FilmDto>>> GetAll()
        {
            var films = await _filmService.GetAllFilmsAsync();
            return Ok(films);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<FilmDto>> GetById(Guid id)
        {
            var film = await _filmService.GetFilmByIdAsync(id);
            if (film is null)
                return NotFound($"Film with id {id} not found.");
            return Ok(film);
        }

        [HttpPost]
        public async Task<ActionResult<FilmDto>> Create([FromBody] CreateFilmDto dto)
        {
            var createdFilm = await _filmService.CreateFilmAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdFilm.Id }, createdFilm);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateFilmDto dto)
        {
            try
            {
                await _filmService.UpdateFilmAsync(id, dto);
                return NoContent();
            }
            catch (ArgumentNullException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _filmService.DeleteFilmAsync(id);
            return NoContent();
        }
    }
}
