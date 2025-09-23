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
    public class AppearanceRepository : IAppearanceRepository
    {
        private readonly AppearanceDbContext _context;

        public AppearanceRepository(AppearanceDbContext context)
        {
            _context = context;
        }

        public async Task<Appearance?> GetByIdAsync(Guid id)
        {
            return await _context.Appearances.FindAsync(id);
        }

        public async Task<IEnumerable<Appearance>> GetAllAsync()
        {
            return await _context.Appearances.ToListAsync();
        }

        public async Task AddAsync(Appearance appearance)
        {
            await _context.Appearances.AddAsync(appearance);
        }

        public async Task UpdateAsync(Appearance appearance)
        {
            _context.Appearances.Update(appearance);
        }
    }
}
