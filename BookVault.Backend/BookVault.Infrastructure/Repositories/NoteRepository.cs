using BookVault.Application.DTOs.NoteDTOs;
using BookVault.Application.Interfaces;
using BookVault.Domain.Entities;
using BookVault.Domain.Interfaces;
using BookVault.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Infrastructure.Repositories
{
    public class NoteRepository : INoteRepository
    {
        private readonly NoteDbContext _noteDbContext;
        public NoteRepository(NoteDbContext noteDbContext)
        {
            _noteDbContext = noteDbContext;
        }
        public async Task<IEnumerable<Note>> GetNotesByUserAndBookAsync(Guid userId, Guid bookId)
        {
            return await _noteDbContext.Notes
                .Where(n => n.UserId == userId && n.BookId == bookId)
                .ToListAsync();
        }

        public async Task<Note?> GetByUserBookAndPageAsync(Guid userId, Guid bookId, int pageNumber)
        {
            return await _noteDbContext.Notes
                .FirstOrDefaultAsync(n => n.UserId == userId
                                       && n.BookId == bookId
                                       && n.PageNumber == pageNumber);
        }

        public async Task<Note?> GetByIdAsync(Guid noteId) =>
            await _noteDbContext.Notes.FirstOrDefaultAsync(n => n.Id == noteId);

        public async Task<Note> AddAsync(Note note)
        {
            await _noteDbContext.Notes.AddAsync(note);
            await _noteDbContext.SaveChangesAsync();
            return note;
        }

        public async Task UpdateAsync(Note note)
        {
            _noteDbContext.Notes.Update(note);
            await _noteDbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(Note note)
        {
            _noteDbContext.Notes.Remove(note);
            await _noteDbContext.SaveChangesAsync();
        }
    }
}
