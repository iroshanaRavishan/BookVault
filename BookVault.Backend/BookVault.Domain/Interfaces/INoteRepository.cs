using BookVault.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Domain.Interfaces
{
    public interface INoteRepository
    {
        Task<Note?> GetByIdAsync(Guid id);
        Task<Note?> AddAsync(Note note);
        Task<Note?> GetByBookAndUserAsync(Guid Id);
        Task UpdateAsync(Note note);
        Task DeleteAsync(Note note);
    }
}
