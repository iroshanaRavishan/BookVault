﻿using BookVault.Application.DTOs.AuthDTOs;
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
                _logger.LogError(ex, "Error getting authenticated user: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<(bool IsSuccess, string Message)> LoginUserAsync(UserLoginDto login)
        {
            try
            {
                var user = new User
                {
                    Email = login.Email,
                    RawPassword = login.Password // Raw password; passed here temporarily
                };

                return await _authRepository.LoginUserAsync(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging in user: {Message}", ex.Message);
                return (false, "Internal server error.");
            }
        }

        public async Task LogoutUserAsync()
        {
            try
            {
                await _authRepository.LogoutUserAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging out the user: {Message}", ex.Message);
                throw;
            }
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering the user: {Message}", ex.Message);
                throw; // Or log and rethrow
            }
        }

    }
}
