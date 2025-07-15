using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.DTOs.BookDTOs
{
    public class BookmarkCreateDto
    {
        public Guid UserId { get; set; }
        public Guid BookId { get; set; }
        public int PageNumber { get; set; }
        public string? BookmarkThumbnailPath { get; set; }
    }
}
