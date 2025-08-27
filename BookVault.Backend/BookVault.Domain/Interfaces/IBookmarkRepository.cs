using BookVault.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Domain.Interfaces
{
    public interface IBookmarkRepository
    {
        Task<IEnumerable<Bookmark>> GetAllAsync(Guid userId, Guid bookId, string sortBy);
        Task<Bookmark?> GetByIdAsync(Guid bookmarkId);
        Task AddAsync(Bookmark bookmark);
        Task<bool> DeleteByIdAsync(Guid id);
        Task<bool> DeleteAsync(Bookmark bookmark);
        Task <bool>UpdateAllBookmarkThumbnailPathAsync(Guid userId, Guid bookId, string newThumbnailImagePath);
    }
}
