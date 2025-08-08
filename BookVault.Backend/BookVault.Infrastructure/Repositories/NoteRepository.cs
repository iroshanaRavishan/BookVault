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

        public async Task<Note?> GetByIdAsync(Guid id) =>
            await _noteDbContext.Notes.FirstOrDefaultAsync(n => n.Id == id);

        public async Task<Note?> GetByBookAndUserAsync(Guid Id) =>
            await _noteDbContext.Notes.FirstOrDefaultAsync(n => n.Id == Id);

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
    }
}
