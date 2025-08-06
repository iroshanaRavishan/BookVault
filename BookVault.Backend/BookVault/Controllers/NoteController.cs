using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BookVault.Application.DTOs.NoteDTOs;
using BookVault.Application.Interfaces;

namespace BookVault.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private readonly INoteService _noteService;
        public NoteController(INoteService noteService)
        {
            _noteService = noteService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateNote([FromBody] CreateNoteDTO dto)
        {
            var createdNote = await _noteService.AddAsync(dto);
            return Ok(new { Message = "Note created successfully", Note = createdNote });
        }
    }
}
