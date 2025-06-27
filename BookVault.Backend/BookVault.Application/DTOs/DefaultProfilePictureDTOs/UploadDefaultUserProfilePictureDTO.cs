using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.DTOs.DefaultProfilePictureDTOs
{
    public class UploadDefaultUserProfilePictureDTO
    {
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public string Base64Data { get; set; }
    }
}
