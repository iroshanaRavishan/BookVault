using BookVault.Domain.Entities;
using BookVault.Domain.Interfaces;
using BookVault.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Infrastructure.Repositories
{
    public class DefaultUserProfilePictureRepository : IDefaultUserProfilePictureRepository
    {
        private readonly DefaultUserProfilePictureDbContext _defaultUserProfilePictureDbContext;
        public DefaultUserProfilePictureRepository(DefaultUserProfilePictureDbContext defaultUserProfilePictureDbContext)
        {
            _defaultUserProfilePictureDbContext = defaultUserProfilePictureDbContext;
        }
        public Task<bool> DeleteImageAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<byte[]>> GetAllImageDataAsync()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<DefaultUserProfileImage>> GetAllImagesAsync()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<DefaultUserProfileImage>> GetAllImagesWithDataAsync()
        {
            throw new NotImplementedException();
        }

        public Task<DefaultUserProfileImage?> GetImageByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<byte[]?> GetImageDataByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<int> UploadImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file uploaded!");

            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                var image = new DefaultUserProfileImage
                {
                    FileName = file.FileName,
                    ContentType = file.ContentType,
                    Data = memoryStream.ToArray()
                };

                _defaultUserProfilePictureDbContext.DefaultUserProfilePictures.Add(image);
                await _defaultUserProfilePictureDbContext.SaveChangesAsync();

                return image.Id;
            }
        }
    }
}
