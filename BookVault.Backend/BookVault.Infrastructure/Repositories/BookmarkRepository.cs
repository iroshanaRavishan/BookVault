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
    public class BookmarkRepository : IBookmarkRepository
    {
        private readonly BookmarkDbContext _context;

        public BookmarkRepository(BookmarkDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Bookmark>> GetAllAsync(Guid userId, Guid bookId, string sortBy)
        {
            var query = _context.Bookmarks
                .Where(b => b.UserId == userId && b.BookId == bookId);

            query = sortBy switch
            {
                "newest" => query.OrderByDescending(b => b.CreatedAt),
                "oldest" => query.OrderBy(b => b.CreatedAt),
                "page-asc" => query.OrderBy(b => b.PageNumber),
                "page-desc" => query.OrderByDescending(b => b.PageNumber),
                _ => query.OrderBy(b => b.PageNumber)
            };

            return await query.ToListAsync();
        }

        public async Task<Bookmark?> GetByIdAsync(Guid bookmarkId)
        {
            return await _context.Bookmarks
                .FirstOrDefaultAsync(b => b.Id == bookmarkId);
        }

        public async Task AddAsync(Bookmark bookmark)
        {
            await _context.Bookmarks.AddAsync(bookmark);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteByIdAsync(Guid id)
        {
            var bookmark = await _context.Bookmarks.FindAsync(id);
            if (bookmark == null) return false;

            _context.Bookmarks.Remove(bookmark);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Bookmark bookmark)
        {
            _context.Bookmarks.Remove(bookmark);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
