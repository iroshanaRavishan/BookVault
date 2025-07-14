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

        public async Task<IEnumerable<BookmarkResponseDto>> GetAllAsync(Guid userId, Guid bookId)
        {
            var bookmarks = await _bookmarkRepository.GetAllAsync(userId, bookId);

            return bookmarks.Select(b => new BookmarkResponseDto
            {
                Id = b.Id,
                UserId = b.UserId,
                BookId = b.BookId,
                PageNumber = b.PageNumber,
                CreatedAt = b.CreatedAt,
                BookmarkThumbnailPath = b.BookmarkThumbnailPath
            });
        }

        public async Task<BookmarkResponseDto> CreateAsync(BookmarkCreateDto dto)
        {
            var bookmark = Bookmark.Create(dto.UserId, dto.BookId, dto.PageNumber, dto.BookmarkThumbnailPath);
            await _bookmarkRepository.AddAsync(bookmark);

            return new BookmarkResponseDto
            {
                Id = bookmark.Id,
                UserId = bookmark.UserId,
                BookId = bookmark.BookId,
                PageNumber = bookmark.PageNumber,
                CreatedAt = bookmark.CreatedAt,
                BookmarkThumbnailPath = bookmark.BookmarkThumbnailPath
            };
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
