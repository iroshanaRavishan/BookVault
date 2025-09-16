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
        }
    }
}
