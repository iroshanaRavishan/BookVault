using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.DTOs.AuthDTOs
{
    public class UserUpdateDto
    {
        public string UserName { get; set; }

        public string Email { get; set; }

        public string? Password { get; set; }

        public string CurrentPassword { get; set; }

        public IFormFile? ProfilePicture { get; set; }
    }
}
