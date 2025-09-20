using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.DTOs.AppearanceDTOs
{
    public class AppearanceCreateDto
    {
        public Guid UserId { get; set; }
        public string Color { get; set; } = "#f1c40f";
    }
}
