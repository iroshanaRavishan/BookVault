using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.DTOs.BookmarkDTOs
{
    public class BookmarkUpdateDto
    {
        public required Guid UserId { get; set; }
        public required Guid BookId { get; set; }
        public required string BookmarkThumbnailImagePath { get; set; }
    }
}
