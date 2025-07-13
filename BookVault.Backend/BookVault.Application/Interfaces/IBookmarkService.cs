using BookVault.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.Interfaces
{
    public interface IBookmarkService
    {
        Task<IEnumerable<Bookmark>> GetAllAsync(Guid userId, Guid bookId);
        Task<Bookmark> CreateAsync(Guid userId, Guid bookId, int pageNumber, string? thumbnailPath);
        Task<bool> DeleteAsync(Guid bookmarkId);
    }
}