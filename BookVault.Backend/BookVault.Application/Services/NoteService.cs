using BookVault.Application.DTOs.NoteDTOs;
using BookVault.Application.Interfaces;
using BookVault.Domain.Entities;
using BookVault.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.Services
{
    public class NoteService : INoteService
    {
        private readonly INoteRepository _noteRepository;

        public NoteService(INoteRepository noteRepository)
        {
            _noteRepository = noteRepository;
        }

        public async Task<ResponseNoteDTO> AddAsync(CreateNoteDTO dto)
        {
            var note = Note.Create(dto.UserId, dto.BookId, dto.PageNumber, dto.Content);

            var createdNote = await _noteRepository.AddAsync(note);

            return MapToResponseDto(createdNote);
        }

        public async Task<ResponseNoteDTO> UpdateNoteAsync(Guid Id, UpdateNoteDTO dto)
        {
            var existingNote = await _noteRepository.GetByBookAndUserAsync(Id);
            if (existingNote == null) return null;

            existingNote.Update(dto.Id, dto.Content);
        }

        private static ResponseNoteDTO MapToResponseDto(Note note) =>
            new ResponseNoteDTO
            {
                Id = note.Id,
                UserId = note.UserId,
                BookId = note.BookId,
                PageNumber = note.PageNumber,
                Content = note.Content,
                CreatedAt = note.CreatedAt,
                UpdatedAt = note.UpdatedAt
            };

    }
}
