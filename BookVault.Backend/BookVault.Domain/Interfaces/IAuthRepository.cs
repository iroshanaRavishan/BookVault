using BookVault.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Domain.Interfaces
{
    public interface IAuthRepository
    {
        Task<IdentityResult> RegisterUserAsync(User user, string password);
        Task<(bool IsSuccess, string Message)> LoginUserAsync(User userLogin);
        Task LogoutUserAsync();
        Task<User> GetAuthenticatedUserAsync(ClaimsPrincipal user);
        Task<IdentityResult> UpdateUserAsync(User user);
        Task<IdentityResult> RemoveUserPasswordAsync(User user);
        Task<IdentityResult> AddUserPasswordAsync(User user, string newPassword);
    }
}
