using BookVault.Application.DTOs.DefaultProfilePictureDTOs;
using BookVault.Application.Interfaces;
using BookVault.Domain.Entities;
using BookVault.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.Services
{
    public class DefaultUserProfilePictureService : IDefaultUserProfilePictureService
    {
        private readonly IDefaultUserProfilePictureRepository _repository;

        public DefaultUserProfilePictureService(IDefaultUserProfilePictureRepository repository)
        {
            _repository = repository;
        }

        public async Task<Guid> UploadImageAsync(UploadDefaultUserProfilePictureDTO uploadDto)
        {
            if (string.IsNullOrEmpty(uploadDto.Base64Data))
                throw new ArgumentException("Base64 data is required");

            var bytes = Convert.FromBase64String(uploadDto.Base64Data);

            var image = DefaultUserProfilePicture.Create(
                uploadDto.FileName,
                uploadDto.ContentType,
                bytes
            );

            return await _repository.UploadImageAsync(image);
        }

        public async Task<IEnumerable<DefaultUserProfilePictureDTO>> GetAllImagesAsync()
        {
            var images = await _repository.GetAllImagesAsync();

            return images.Select(img => new DefaultUserProfilePictureDTO
            {
                Id = img.Id,
                FileName = img.FileName,
                ContentType = img.ContentType,
                ImageUrl = $"/api/DefaultUserProfilePicture/{img.Id}/file"
            });
        }

        public async Task<IEnumerable<DefaultUserProfilePictureWithDataDTO>> GetAllImagesWithDataAsync()
        {
            var images = await _repository.GetAllImagesWithDataAsync();

            return images.Select(img => new DefaultUserProfilePictureWithDataDTO
            {
                Id = img.Id,
                FileName = img.FileName,
                ContentType = img.ContentType,
                Base64Image = Convert.ToBase64String(img.Data)
            });
        }

        public async Task<DefaultUserProfilePictureWithDataDTO?> GetImageByIdAsync(Guid id)
        {
            var image = await _repository.GetImageByIdAsync(id);
            if (image == null) return null;

            return new DefaultUserProfilePictureWithDataDTO
            {
                Id = image.Id,
                FileName = image.FileName,
                ContentType = image.ContentType,
                Base64Image = Convert.ToBase64String(image.Data)
            };
        }

        public async Task<IEnumerable<string>> GetAllImageDataAsync()
        {
            var dataList = await _repository.GetAllImageDataAsync();
            return dataList.Select(Convert.ToBase64String);
        }

        public async Task<string?> GetImageDataByIdAsync(Guid id)
        {
            var data = await _repository.GetImageDataByIdAsync(id);
            return data != null ? Convert.ToBase64String(data) : null;
        }

        public async Task<bool> DeleteImageAsync(Guid id)
        {
            return await _repository.DeleteImageAsync(id);
        }
    }
}
