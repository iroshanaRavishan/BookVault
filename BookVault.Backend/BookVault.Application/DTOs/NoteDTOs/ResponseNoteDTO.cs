using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.DTOs.NoteDTOs
{
    public class ResponseNoteDTO
    {
        public Guid Id { get; private set; }
        public Guid UserId { get; private set; }
        public Guid BookId { get; private set; }
        public int PageNumber { get; private set; }
        public string? Content { get; private set; }
        public DateTimeOffset CreatedAt { get; private set; }
        public DateTimeOffset UpdatedAt { get; private set; }
    }
}
