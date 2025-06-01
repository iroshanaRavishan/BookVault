using BookVault.Application.DTOs.AuthDTOs;
using BookVault.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BookVault.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> RegisterUser([FromForm] UserRegistrationDto user)
        {
            try
            {
                var result = await _authService.RegisterUserAsync(user);
                if (!result.Succeeded)
                {
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"Something went wrong, Please try again later. {ex.Message}",
                    isSuccess = false
                });
            }
            return Ok(new { message = "Registration Successful!", isSuccess = true });
        }
    }
}
