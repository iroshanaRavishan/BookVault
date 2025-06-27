using BookVault.Domain.Entities;
using BookVault.Domain.Interfaces;
using BookVault.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Infrastructure.Repositories
{

    public class AuthRepository : IAuthRepository
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ILogger<AuthRepository> _logger;
        public AuthRepository(UserManager<User> userManager, SignInManager<User> signInManager, ILogger<AuthRepository> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<User> GetAuthenticatedUserAsync(ClaimsPrincipal user)
        {
            try
            {
                return await _signInManager.UserManager.GetUserAsync(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving the user: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<(bool IsSuccess, string Message)> LoginUserAsync(User userLogin)
        {
            // Find user by email
            var user = await _userManager.FindByEmailAsync(userLogin.Email);
            if (user == null)
                return (false, "The Email does not exist. Please check your credentials and try again!");

            // Optionally confirm the email
            if (!user.EmailConfirmed)
            {
                user.EmailConfirmed = true;
                await _userManager.UpdateAsync(user);
            }

            // Validate password (make sure userLogin.Password is plain text, not hashed)
            var result = await _signInManager.PasswordSignInAsync(user.UserName, userLogin.RawPassword, isPersistent: false, lockoutOnFailure: false);
            if (!result.Succeeded)
                return (false, "Invalid credentials. Please check your credentials and try again!");

            user.LastLogin = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            return (true, "Login successful.");
        }

        public async Task LogoutUserAsync()
        {
            try
            {
                await _signInManager.SignOutAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging out the user: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<IdentityResult> RegisterUserAsync(User user, string password)
        {
            try
            {
                return await _userManager.CreateAsync(user, password);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving the user: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<IdentityResult> UpdateUserAsync(User user)
        {
            try
            {
                return await _userManager.UpdateAsync(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<IdentityResult> RemoveUserPasswordAsync(User user)
        {
            try
            {
                return await _userManager.RemovePasswordAsync(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing user password: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<IdentityResult> AddUserPasswordAsync(User user, string newPassword)
        {
            try
            {
                return await _userManager.AddPasswordAsync(user, newPassword);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding new user password: {Message}", ex.Message);
                throw;
            }
        }
    }
}
