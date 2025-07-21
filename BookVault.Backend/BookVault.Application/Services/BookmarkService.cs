using BookVault.Application.DTOs.BookDTOs;
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
        private readonly INotificationService _notificationService;

        public BookmarkService(IBookmarkRepository bookmarkRepository, INotificationService notificationService)
        {
            _bookmarkRepository = bookmarkRepository;
            _notificationService = notificationService;
        }

        public async Task<IEnumerable<BookmarkResponseDto>> GetAllAsync(Guid userId, Guid bookId, string sortBy)
        {
            var bookmarks = await _bookmarkRepository.GetAllAsync(userId, bookId, sortBy);

            return bookmarks.Select(b => new BookmarkResponseDto
            {
                Id = b.Id,
                UserId = b.UserId,
                BookId = b.BookId,
                PageNumber = b.PageNumber,
                Color = b.Color,
                CreatedAt = b.CreatedAt,
                BookmarkThumbnailPath = b.BookmarkThumbnailPath
            });
        }

        public async Task<BookmarkResponseDto> CreateAsync(BookmarkCreateDto dto)
        {
            var bookmark = Bookmark.Create(dto.UserId, dto.BookId, dto.PageNumber, dto.Color, dto.BookmarkThumbnailPath);
            await _bookmarkRepository.AddAsync(bookmark);

            var response = new BookmarkResponseDto
            {
                Id = bookmark.Id,
                UserId = bookmark.UserId,
                BookId = bookmark.BookId,
                PageNumber = bookmark.PageNumber,
                Color = bookmark.Color,
                CreatedAt = bookmark.CreatedAt,
                BookmarkThumbnailPath = bookmark.BookmarkThumbnailPath
            };

            // Notify via SignalR
            await _notificationService.NotifyBookmarkCreatedAsync(response);

            return response;
        }

        public async Task<bool> DeleteAsync(Guid bookmarkId)
        {
            var bookmark = await _bookmarkRepository.GetByIdAsync(bookmarkId);
            if (bookmark is null) return false;

            await _bookmarkRepository.DeleteAsync(bookmark);

            // Notify via SignalR
            await _notificationService.NotifyBookmarkDeletedAsync(bookmarkId);

            return true;
        }
    }
}
