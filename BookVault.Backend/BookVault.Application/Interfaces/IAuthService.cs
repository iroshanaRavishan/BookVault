using BookVault.Application.DTOs.AuthDTOs;
using BookVault.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.Interfaces
{
    public interface IAuthService
    {
        Task<IdentityResult> RegisterUserAsync(UserRegistrationDto modal);
        Task<(bool IsSuccess, string Message)> LoginUserAsync(UserLoginDto login);
        Task LogoutUserAsync();
        Task<User> GetAuthenticatedUserAsync(ClaimsPrincipal user);
    }
}
