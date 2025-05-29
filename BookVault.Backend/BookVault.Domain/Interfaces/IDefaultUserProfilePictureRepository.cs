using BookVault.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Domain.Interfaces
{
    public interface IDefaultUserProfilePictureRepository
    {
        Task<int> UploadImageAsync(IFormFile file);
        Task<DefaultUserProfilePicture?> GetImageByIdAsync(int id);
        Task<IEnumerable<DefaultUserProfilePicture>> GetAllImagesAsync();
        Task<IEnumerable<DefaultUserProfilePicture>> GetAllImagesWithDataAsync();
        Task<IEnumerable<byte[]>> GetAllImageDataAsync();
        Task<byte[]?> GetImageDataByIdAsync(int id);
        Task<bool> DeleteImageAsync(int id);
    }
}
