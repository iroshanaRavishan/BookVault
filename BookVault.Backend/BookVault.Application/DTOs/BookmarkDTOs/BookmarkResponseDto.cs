using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.DTOs.BookDTOs
{
    public class BookmarkResponseDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid BookId { get; set; }
        public int PageNumber { get; set; }
        public required string Color { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public string? BookmarkThumbnailSourcePath { get; set; }
        public string? BookmarkThumbnailImagePath { get; set; }
    }
}
