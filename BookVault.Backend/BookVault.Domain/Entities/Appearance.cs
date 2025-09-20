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
            ValidateInputs(color, brightness, fromTime, toTime);

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

        // Static factory
        public static Appearance Create(Guid userId, string color, bool marginEnabled, double brightness,
            bool isDarkTheme, bool isDimmed, bool isFocusMode,
            bool isAutoThemeEnabled, string fromTime, string toTime)
        {
            return new Appearance(userId, color, marginEnabled, brightness,
                isDarkTheme, isDimmed, isFocusMode, isAutoThemeEnabled, fromTime, toTime);
        }

        // Update method
        public void Update(Guid userId, string color, bool marginEnabled, double brightness,
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

            UpdateLastModified();
        }

        // Validation rules
        private static void ValidateInputs(string color, double brightness, string fromTime, string toTime)
        {
            if (string.IsNullOrWhiteSpace(color))
                throw new ArgumentException("Color cannot be empty.", nameof(color));

            if (!color.StartsWith("#") || (color.Length != 7 && color.Length != 4))
                throw new ArgumentException("Color must be a valid hex code (e.g. #fff or #ffffff).", nameof(color));

            if (brightness < 0 || brightness > 1.5)
                throw new ArgumentException("Brightness must be between 0 and 1.", nameof(brightness));

            if (string.IsNullOrWhiteSpace(fromTime))
                throw new ArgumentException("FromTime cannot be empty.", nameof(fromTime));

            if (string.IsNullOrWhiteSpace(toTime))
                throw new ArgumentException("ToTime cannot be empty.", nameof(toTime));

            // Optional: validate format like "09:00 PM"
            if (!DateTime.TryParse(fromTime, out _))
                throw new ArgumentException("FromTime must be a valid time string.", nameof(fromTime));

            if (!DateTime.TryParse(toTime, out _))
                throw new ArgumentException("ToTime must be a valid time string.", nameof(toTime));
        }
    }
}
