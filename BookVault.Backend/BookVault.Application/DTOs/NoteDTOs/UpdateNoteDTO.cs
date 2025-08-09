using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.DTOs.NoteDTOs
{
    public class UpdateNoteDTO
    {
        public Guid Id { get; set; }
        public required string Content { get; set; }
    }
}
