using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.DTOs.AppearanceDTOs
{
    public class AppearanceReadDto
    {
        public Guid Id { get; set; }   // From EntityBase
        public Guid UserId { get; set; }
    }
}
