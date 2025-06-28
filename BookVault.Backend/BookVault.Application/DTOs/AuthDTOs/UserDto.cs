using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.DTOs.AuthDTOs
{
    public class UserDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public bool IsAdmin { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime LastLogin { get; set; }

        public string ProfilePictureUrl { get; set; } // This can be a base64 or endpoint URL
    }
}
