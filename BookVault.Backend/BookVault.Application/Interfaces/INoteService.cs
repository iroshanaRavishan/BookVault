using BookVault.Application.DTOs.NoteDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.Interfaces
{
    public interface INoteService
    {
        Task<ResponseNoteDTO> AddAsync(CreateNoteDTO dto);
        Task<ResponseNoteDTO> UpdateNoteAsync(Guid Id, UpdateNoteDTO dto);
        Task<bool> DeleteNoteAsync(Guid noteId);
    }
}
