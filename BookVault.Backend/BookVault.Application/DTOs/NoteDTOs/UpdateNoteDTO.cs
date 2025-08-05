using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.DTOs.NoteDTOs
{
    public class UpdateNoteDTO
    {
        public required Guid UserId { get; set; }
        public required Guid BookId { get; set; }
        public required string Content { get; set; }
    }
}
