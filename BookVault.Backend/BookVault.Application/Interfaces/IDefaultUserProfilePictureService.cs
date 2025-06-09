using BookVault.Application.DTOs.DefaultProfilePictureDTOs;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.Interfaces
{
    public interface IDefaultUserProfilePictureService
    {
        Task<Guid> UploadImageAsync(UploadDefaultUserProfilePictureDTO uploadDto);
        Task<DefaultUserProfilePictureWithDataDTO?> GetImageByIdAsync(Guid id);
        Task<IEnumerable<DefaultUserProfilePictureDTO>> GetAllImagesAsync();
        Task<IEnumerable<DefaultUserProfilePictureWithDataDTO>> GetAllImagesWithDataAsync();
        Task<IEnumerable<string>> GetAllImageDataAsync(); // base64 strings
        Task<string?> GetImageDataByIdAsync(Guid id);     // base64 string
        Task<bool> DeleteImageAsync(Guid id);
    }
}
