using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Domain.Entities
{
    public sealed class Note
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
        public string? Content { get; private set; }

        [Required]
        public DateTimeOffset CreatedAt { get; private set; }

        [Required]
        public DateTimeOffset UpdatedAt { get; private set; }

        // EF Core parameterless constructor
        private Note() { }
        private Note(Guid id, Guid userId, Guid bookId, int pageNumber, string? content, DateTimeOffset createdAt, DateTimeOffset updatedAt)
        {
            Id = id;
            UserId = userId;
            BookId = bookId;
            PageNumber = pageNumber;
            Content = content;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }
    }
}
