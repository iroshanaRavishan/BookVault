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
        private readonly IPasswordValidator<User> _passwordValidator;
        private readonly UserManager<User> _userManager;
        public AuthService(
            IAuthRepository authRepository, 
            ILogger<AuthService> logger, 
            IPasswordValidator<User> passwordValidator,
            UserManager<User> userManager)
        {
            _authRepository = authRepository;
            _logger = logger;
            _passwordValidator = passwordValidator;
            _userManager = userManager;
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

        public async Task<(bool IsSuccess, string Message, IdentityResult? Result)> UpdateUserProfileAsync(ClaimsPrincipal principal, UserUpdateDto dto)
        {
            try
            {
                var user = await _authRepository.GetAuthenticatedUserAsync(principal);
                if (user == null)
                    return (false, "User not found", null);

                // Require current password for any update
                if (string.IsNullOrWhiteSpace(dto.CurrentPassword))
                {
                    return (false, "Current password is required", IdentityResult.Failed(
                        new IdentityError { Description = "Current password is required" }));
                }

                var passwordCheck = await _userManager.CheckPasswordAsync(user, dto.CurrentPassword);
                if (!passwordCheck)
                {
                    return (false, "Current password is incorrect", IdentityResult.Failed(
                        new IdentityError { Description = "Current password is incorrect" }));
                }

                user.UserName = dto.UserName;
                user.Email = dto.Email;
                user.ModifiedDate = DateTime.UtcNow;

                // Update password if provided
                if (!string.IsNullOrWhiteSpace(dto.Password))
                {
                    // Validate new password
                    var passwordValidationResult = await _passwordValidator.ValidateAsync(_userManager, user, dto.Password);
                    if (!passwordValidationResult.Succeeded)
                    {
                        return (false, "Password does not meet security requirements", passwordValidationResult);
                    }

                    // Remove and add new password
                    var removeResult = await _authRepository.RemoveUserPasswordAsync(user);
                    if (!removeResult.Succeeded)
                        return (false, "Failed to remove old password", removeResult);

                    var addResult = await _authRepository.AddUserPasswordAsync(user, dto.Password);
                    if (!addResult.Succeeded)
                        return (false, "Failed to update password", addResult);
                }

                // Handle profile picture update (convert to byte[])
                if (dto.ProfilePicture != null && dto.ProfilePicture.Length > 0)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await dto.ProfilePicture.CopyToAsync(memoryStream);
                        user.ProfilePicture = memoryStream.ToArray();
                        user.ProfilePictureContentType = dto.ProfilePicture.ContentType;
                    }
                }

                var updateResult = await _authRepository.UpdateUserAsync(user);
                if (!updateResult.Succeeded)
                    return (false, "Failed to update user", updateResult);

                return (true, "Profile updated successfully.", IdentityResult.Success);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user profile: {Message}", ex.Message);
                return (false, "Internal server error", IdentityResult.Failed());
            }
        }
    }
}
