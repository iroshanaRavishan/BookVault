using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Domain.Entities
{
    public sealed class Bookmark
    {
        [Key]
        public Guid Id { get; private set; }

        [Required]
        public Guid UserId { get; private set; }

        [Required]
        public Guid BookId { get; private set; }

        [Required]
        public int PageNumber { get; private set; }

        [Required]
        public string Color { get; private set; }

        [Required]
        public DateTimeOffset CreatedAt { get; private set; }

        public string? BookmarkThumbnailSourcePath { get; private set; }

        public string? BookmarkThumbnailImagePath { get; private set; }

        // EF Core parameterless constructor
        private Bookmark() { }

        private Bookmark(Guid id, Guid userId, Guid bookId, int pageNumber, string color, DateTimeOffset createdAt, string? thumbnailSourcePath, string? thumbnailImagePath)
        {
            Id = id;
            UserId = userId;
            BookId = bookId;
            PageNumber = pageNumber;
            Color = color;
            CreatedAt = createdAt;
            BookmarkThumbnailSourcePath = thumbnailSourcePath;
            BookmarkThumbnailImagePath = thumbnailImagePath;
        }

        public static Bookmark Create(Guid userId, Guid bookId, int pageNumber, string color, string? thumbnailSourcePath, string? thumbnailImagePath)
        {
            ValidateInputs(userId, bookId, pageNumber, color);

            return new Bookmark(
                Guid.NewGuid(),
                userId,
                bookId,
                pageNumber,
                color,
                DateTimeOffset.UtcNow,
                thumbnailSourcePath,
                thumbnailImagePath
            );
        }
        public void UpdateThumbnailPath(Guid userId, Guid bookId, string? newThumbnailImagePath)
        {
            UserId = userId;
            BookId = bookId;
            BookmarkThumbnailImagePath = newThumbnailImagePath;
        }

        private static void ValidateInputs(Guid userId, Guid bookId, int pageNumber, string color)
        {
            if (userId == Guid.Empty)
                throw new ArgumentException("UserId cannot be empty.", nameof(userId));

            if (bookId == Guid.Empty)
                throw new ArgumentException("BookId cannot be empty.", nameof(bookId));

            if (pageNumber <= 0)
                throw new ArgumentException("Page number must be greater than zero.", nameof(pageNumber));
            
            if (color == "")
                throw new ArgumentException("Color cannot be empty.", nameof(color));
        }
    }
}
