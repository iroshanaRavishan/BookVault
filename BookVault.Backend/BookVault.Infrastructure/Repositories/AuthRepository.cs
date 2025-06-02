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

        public Task<User> GetProfilePictureAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public async Task<(bool IsSuccess, string Message)> LoginUserAsync(User userLogin)
        {
            var user = await _userManager.FindByNameAsync(userLogin.UserName);
            if (user == null)
                return (false, "User not found.");

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, userLogin.PasswordHash);
            if (!isPasswordValid)
                return (false, "Invalid password.");

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
    }
}
