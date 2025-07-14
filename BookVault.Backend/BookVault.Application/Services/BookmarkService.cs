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
    public class BookmarkService : IBookmarkService
    {
        private readonly IBookmarkRepository _bookmarkRepository;

        public BookmarkService(IBookmarkRepository bookmarkRepository)
        {
            _bookmarkRepository = bookmarkRepository;
        }

        public async Task<IEnumerable<Bookmark>> GetAllAsync(Guid userId, Guid bookId)
        {
            return await _bookmarkRepository.GetAllAsync(userId, bookId);
        }

        public async Task<Bookmark> CreateAsync(Guid userId, Guid bookId, int pageNumber, string? thumbnailPath)
        {
            var bookmark = Bookmark.Create(userId, bookId, pageNumber, thumbnailPath);
            await _bookmarkRepository.AddAsync(bookmark);
            return bookmark;
        }

        public async Task<bool> DeleteAsync(Guid bookmarkId)
        {
            var bookmark = await _bookmarkRepository.GetByIdAsync(bookmarkId);
            if (bookmark is null) return false;

            await _bookmarkRepository.DeleteAsync(bookmark);
            return true;
        }
    }
}
