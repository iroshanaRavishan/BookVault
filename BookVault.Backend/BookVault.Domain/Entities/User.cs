using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Domain.Entities
{
    public class User : IdentityUser
    {
        [MaxLength(50)]
        public string Name { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public DateTime ModifiedDate { get; set; } = DateTime.UtcNow;

        public DateTime LastLogin { get; set; } = DateTime.UtcNow;

        public bool IsAdmin { get; set; } = false;

        public byte[] ProfilePicture { get; set; }

        public string ProfilePictureContentType { get; set; }


        [NotMapped] // This ensures EF won't treat it as a DB column
        public string RawPassword { get; set; }
    }
}
