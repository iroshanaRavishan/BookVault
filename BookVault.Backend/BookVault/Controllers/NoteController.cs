using BookVault.Application.DTOs.NoteDTOs;
using BookVault.Application.Interfaces;
using BookVault.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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

        [HttpGet("{userId}/{bookId}")]
        public async Task<IActionResult> GetNotesByUserAndBook(Guid userId, Guid bookId)
        {
            var notes = await _noteService.GetNotesByUserAndBookAsync(userId, bookId);
            return Ok(notes);
        }

        [HttpPost]
        public async Task<IActionResult> CreateNote([FromBody] CreateNoteDTO dto)
        {
            var createdNote = await _noteService.AddAsync(dto);
            return Ok(new { Message = "Note created successfully", Note = createdNote });
        }

        [HttpPut("{noteId}")]
        public async Task<IActionResult> UpdateNote(Guid noteId, [FromBody] UpdateNoteDTO dto)
        {
            var updatedNote = await _noteService.UpdateNoteAsync(noteId, dto);
            if (updatedNote == null)
                return NotFound();

            return Ok(updatedNote);
        }

        [HttpDelete("{noteId}")]
        public async Task<IActionResult> DeleteNote(Guid noteId)
        {
            var deleted = await _noteService.DeleteNoteAsync(noteId);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
