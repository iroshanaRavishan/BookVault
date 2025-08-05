using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.DTOs.NoteDTOs
{
    public class CreateNoteDTO
    {
        public Guid UserId { get; set; }
        public Guid BookId { get; set; }
        public int PageNumber { get; set; }
        public required string? Content { get; set; }
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    }
}
