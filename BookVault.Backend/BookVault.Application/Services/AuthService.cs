using BookVault.Application.DTOs.AuthDTOs;
using BookVault.Application.Interfaces;
using BookVault.Domain.Entities;
using BookVault.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly ILogger<AuthService> _logger;
        public AuthService(IAuthRepository authRepository, ILogger<AuthService> logger)
        {
            _authRepository = authRepository;
            _logger = logger;
        }
        public async Task<User> GetAuthenticatedUserAsync(ClaimsPrincipal user)
        {
            try
            {
                var authenticatedUser = await _authRepository.GetAuthenticatedUserAsync(user);
                return authenticatedUser;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all books: {Message}", ex.Message);
                throw;
            }
        }

        public Task<User> GetProfilePictureAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public Task<(bool IsSuccess, string Message)> LoginUserAsync(UserLoginDto login)
        {
            throw new NotImplementedException();
        }

        public Task LogoutUserAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<IdentityResult> RegisterUserAsync(UserRegistrationDto model)
        {
            // Map DTO to User entity
            var user = new User
            {
                Name = model.Name,
                Email = model.Email,
                UserName = model.UserName,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow,
                LastLogin = DateTime.UtcNow,
                IsAdmin = false
            };

            // Convert IFormFile to byte[]
            if (model.ProfilePicture != null && model.ProfilePicture.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await model.ProfilePicture.CopyToAsync(memoryStream);
                    user.ProfilePicture = memoryStream.ToArray();
                    user.ProfilePictureContentType = model.ProfilePicture.ContentType;
                }
            }

            // Register the user with password
            try
            {
                var result = await _authRepository.RegisterUserAsync(user, model.Password);
                return result;
            }
            catch (Exception)
            {
                throw; // Or log and rethrow
            }
        }

    }
}
