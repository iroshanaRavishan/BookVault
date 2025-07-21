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
        Task<Guid> UploadImageAsync(DefaultUserProfilePicture picture);
        Task<DefaultUserProfilePicture?> GetImageByIdAsync(Guid id);
        Task<IEnumerable<DefaultUserProfilePicture>> GetAllImagesAsync();
        Task<IEnumerable<DefaultUserProfilePicture>> GetAllImagesWithDataAsync();
        Task<IEnumerable<byte[]>> GetAllImageDataAsync();
        Task<byte[]?> GetImageDataByIdAsync(Guid id);
        Task<bool> DeleteImageAsync(Guid id);
    }
}
