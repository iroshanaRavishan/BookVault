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
        public bool MarginEnabled { get; set; } = true;
        public double Brightness { get; set; } = 1;
        public bool IsDarkTheme { get; set; } = false;
        public bool IsDimmed { get; set; } = false;
        public bool IsFocusMode { get; set; } = false;
        public bool IsAutoThemeEnabled { get; set; } = true;
        public string FromTime { get; set; } = "09:00 PM";
        public string ToTime { get; set; } = "06:00 AM";
    }
}
