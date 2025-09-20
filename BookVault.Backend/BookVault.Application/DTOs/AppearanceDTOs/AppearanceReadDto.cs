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
        public string Color { get; set; }
        public bool MarginEnabled { get; set; }
        public double Brightness { get; set; }
        public bool IsDarkTheme { get; set; }
        public bool IsDimmed { get; set; }
        public bool IsFocusMode { get; set; }
        public bool IsAutoThemeEnabled { get; set; }
    }
}
