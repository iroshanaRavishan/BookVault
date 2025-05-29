using BookVault.Domain.Entities;
using BookVault.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Infrastructure.Repositories
{
    public class DefaultUserProfilePictureRepository : IDefaultUserProfilePictureRepository
    {
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

        public Task<int> UploadImageAsync(IFormFile file)
        {
            throw new NotImplementedException();
        }
    }
}
