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
        public DateTimeOffset CreatedAt { get; private set; }

        public string? BookmarkThumbnailPath { get; private set; }

        // EF Core parameterless constructor
        private Bookmark() { }

        private Bookmark(Guid id, Guid userId, Guid bookId, int pageNumber, DateTimeOffset createdAt, string? thumbnailPath)
        {
            Id = id;
            UserId = userId;
            BookId = bookId;
            PageNumber = pageNumber;
            CreatedAt = createdAt;
            BookmarkThumbnailPath = thumbnailPath;
        }

        public static Bookmark Create(Guid userId, Guid bookId, int pageNumber, string? thumbnailPath)
        {
            ValidateInputs(userId, bookId, pageNumber);

            return new Bookmark(
                Guid.NewGuid(),
                userId,
                bookId,
                pageNumber,
                DateTimeOffset.UtcNow,
                thumbnailPath
            );
        }

        private static void ValidateInputs(Guid userId, Guid bookId, int pageNumber)
        {
            if (userId == Guid.Empty)
                throw new ArgumentException("UserId cannot be empty.", nameof(userId));

            if (bookId == Guid.Empty)
                throw new ArgumentException("BookId cannot be empty.", nameof(bookId));

            if (pageNumber <= 0)
                throw new ArgumentException("Page number must be greater than zero.", nameof(pageNumber));
        }
    }
}
