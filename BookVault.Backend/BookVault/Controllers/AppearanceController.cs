using BookVault.Application.DTOs.AppearanceDTOs;
using BookVault.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookVault.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppearanceController : ControllerBase
    {
        private readonly IAppearanceService _service;

        public AppearanceController(IAppearanceService service)
        {
            _service = service;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppearanceReadDto>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppearanceReadDto>>> GetAll()
        {
            var results = await _service.GetAllAsync();
            return Ok(results);
        }

        [HttpPost]
        public async Task<ActionResult<AppearanceReadDto>> Create([FromBody] AppearanceCreateDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public Task<ActionResult<AppearanceReadDto>> Update(Guid id, [FromBody] AppearanceUpdateDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
        }
    }
}
