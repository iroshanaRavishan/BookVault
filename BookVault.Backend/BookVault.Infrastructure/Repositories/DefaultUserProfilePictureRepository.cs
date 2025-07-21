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

        public async Task<Guid> UploadImageAsync(DefaultUserProfilePicture picture)
        {
            if (picture == null)
                throw new ArgumentNullException(nameof(picture));

            _defaultUserProfilePictureDbContext.DefaultUserProfilePictures.Add(picture);
            await _defaultUserProfilePictureDbContext.SaveChangesAsync();

            return picture.Id;
        }
    }
}
