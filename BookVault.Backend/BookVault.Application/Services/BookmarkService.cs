using BookVault.Application.DTOs.BookDTOs;
using BookVault.Application.Interfaces;
using BookVault.Domain.Entities;
using BookVault.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;  // for IWebHostEnvironment
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
        private readonly IPdfThumbnailService _thumbnailService;
        private readonly ILogger<BookService> _logger;
        private readonly IBookRepository _bookRepository;
        private readonly string _uploadsFolder;

        public BookmarkService(
            IBookmarkRepository bookmarkRepository, 
            INotificationService notificationService, 
            IPdfThumbnailService thumbnailService, 
            ILogger<BookService> logger, 
            IBookRepository bookRepository, 
            Microsoft.AspNetCore.Hosting.IHostingEnvironment environment
            )
        {
            _bookmarkRepository = bookmarkRepository;
            _notificationService = notificationService;
            _thumbnailService = thumbnailService;
            _logger = logger;
            _bookRepository = bookRepository;
            _uploadsFolder = Path.Combine(environment.ContentRootPath, "uploads");
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
            var book = await _bookRepository.GetByIdAsync(dto.BookId);
            var bookmark = Bookmark.Create(dto.UserId, dto.BookId, dto.PageNumber, dto.Color, book.PdfFilePath);

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

        public async Task<bool> DeleteAsync(Guid bookmarkId, bool isLastBookmark)
        {
            var bookmark = await _bookmarkRepository.GetByIdAsync(bookmarkId);
            if (isLastBookmark)
            {
                var fullPath = Path.Combine(_uploadsFolder, "bookmarks");
                if (Directory.Exists(fullPath))
                {
                    var files = Directory.GetFiles(fullPath);
                    foreach (var file in files)
                    {
                        File.Delete(file);
                    }
                }
            }

            await _bookmarkRepository.DeleteAsync(bookmark);
            
            // Notify via SignalR
            await _notificationService.NotifyBookmarkDeletedAsync(bookmarkId);

            return true;
        }

        private void DeleteFileIfExists(string relativePath)
        {
            if (string.IsNullOrEmpty(relativePath))
                return;

            var fullPath = Path.Combine(_uploadsFolder, relativePath);
            if (File.Exists(fullPath))
            {
                try
                {
                    File.Delete(fullPath);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to bookmark thumbnail file: {Path}", fullPath);
                }
            }
        }
    }
}
