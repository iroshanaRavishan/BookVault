using BookVault.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Domain.Entities
{
    public sealed class Appearance : EntityBase
    {
        public Guid UserId { get; private set; }
        public string Color { get; private set; }
        public bool MarginEnabled { get; private set; }
        public double Brightness { get; private set; }
        public bool IsDarkTheme { get; private set; }
        public bool IsDimmed { get; private set; }
        public bool IsFocusMode { get; private set; }
        public bool IsAutoThemeEnabled { get; private set; }
        public string FromTime { get; private set; }
        public string ToTime { get; private set; }  

        // EF Core requires a private parameterless ctor
        private Appearance()
        {
            UserId = Guid.Empty;
            Color = "#ffffff";
            MarginEnabled = true;
            Brightness = 1.0;
            IsDarkTheme = false;
            IsDimmed = false;
            IsFocusMode = false;
            IsAutoThemeEnabled = false;
            FromTime = "12:00 AM";
            ToTime = "12:00 AM";
        }

        private Appearance(Guid userId, string color, bool marginEnabled, double brightness,
            bool isDarkTheme, bool isDimmed, bool isFocusMode,
            bool isAutoThemeEnabled, string fromTime, string toTime)
        {
            UserId = userId;
            Color = color;
            MarginEnabled = marginEnabled;
            Brightness = brightness;
            IsDarkTheme = isDarkTheme;
            IsDimmed = isDimmed;
            IsFocusMode = isFocusMode;
            IsAutoThemeEnabled = isAutoThemeEnabled;
            FromTime = fromTime;
            ToTime = toTime;
        }
    }
}
