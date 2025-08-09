using BookVault.Application.DTOs.NoteDTOs;
using BookVault.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.Interfaces
{
    public interface INoteService
    {
        Task<IEnumerable<Note>> GetNotesByUserAndBookAsync(Guid userId, Guid bookId);
        Task<ResponseNoteDTO> AddAsync(CreateNoteDTO dto);
        Task<ResponseNoteDTO> UpdateNoteAsync(Guid noteId, UpdateNoteDTO dto);
        Task<bool> DeleteNoteAsync(Guid noteId);
    }
}
