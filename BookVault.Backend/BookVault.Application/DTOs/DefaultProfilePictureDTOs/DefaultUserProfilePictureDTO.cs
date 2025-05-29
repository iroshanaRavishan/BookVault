using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.DTOs.DefaultProfilePictureDTOs
{
    public class DefaultUserProfilePictureDTO
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public string ImageUrl { get; set; } // Optional: URL to fetch the image
    }
}
