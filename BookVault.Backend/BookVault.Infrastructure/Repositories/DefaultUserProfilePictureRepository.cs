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
        public async Task<bool> DeleteImageAsync(Guid id)
        {
            var image = await _defaultUserProfilePictureDbContext.DefaultUserProfilePictures
                .FirstOrDefaultAsync(img => img.Id == id);

            if (image == null)
                return false;

            _defaultUserProfilePictureDbContext.DefaultUserProfilePictures.Remove(image);
            await _defaultUserProfilePictureDbContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<byte[]>> GetAllImageDataAsync()
        {
            return await _defaultUserProfilePictureDbContext.DefaultUserProfilePictures
                .Select(img => img.Data)
                .ToListAsync();
        }

        public async Task<IEnumerable<DefaultUserProfilePicture>> GetAllImagesAsync()
        {
            return await _defaultUserProfilePictureDbContext.DefaultUserProfilePictures
                .Select(i => new DefaultUserProfilePicture
                {
                    Id = i.Id,
                    FileName = i.FileName,
                    ContentType = i.ContentType
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<DefaultUserProfilePicture>> GetAllImagesWithDataAsync()
        {
            return await _defaultUserProfilePictureDbContext.DefaultUserProfilePictures.ToListAsync();
        }

        public async Task<DefaultUserProfilePicture?> GetImageByIdAsync(Guid id)
        {
            return await _defaultUserProfilePictureDbContext.DefaultUserProfilePictures
                .FirstOrDefaultAsync(img => img.Id == id);
        }

        public async Task<byte[]?> GetImageDataByIdAsync(Guid id)
        {
            return await _defaultUserProfilePictureDbContext.DefaultUserProfilePictures
                .Where(img => img.Id == id)
                .Select(img => img.Data)
                .FirstOrDefaultAsync();
        }

        public async Task<Guid> UploadImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file uploaded!");

            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                var image = new DefaultUserProfilePicture
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
