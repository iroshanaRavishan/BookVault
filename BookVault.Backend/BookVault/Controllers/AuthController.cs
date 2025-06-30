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

        [HttpPost("login")]
        public async Task<IActionResult> LoginUser(UserLoginDto user)
        {
            var (isSuccess, message) = await _authService.LoginUserAsync(user);
            if (!isSuccess)
                return Unauthorized(new { message, isSuccess = false });

            return Ok(new { message, isSuccess = true });
        }

        [HttpGet("logout")]
        public async Task<IActionResult> LogoutUser()
        {
            try
            {
                await _authService.LogoutUserAsync();
                return Ok(new { message = "Successfully looged out!", isSuccess = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something went wrong! Please try again. " + ex.Message, isSuccess = false });
            }
        }

        [HttpGet("authuser")]
        public async Task<IActionResult> CheckUser()
        {
            try
            {
                var user = await _authService.GetAuthenticatedUserAsync(User);
                if (user == null)
                    return Forbid();

                return Ok(new { message = "Logged In", user, isSuccess = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something went wrong! Please try again. " + ex.Message, isSuccess = false });
            }

        }

        [HttpPut("update-profile")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateUserProfile([FromForm] UserUpdateDto userUpdateDto)
        {
            try
            {
                var (isSuccess, message, result) = await _authService.UpdateUserProfileAsync(User, userUpdateDto);
                if (!isSuccess)
                    return BadRequest(result);

                return Ok(new { message = "Profile updated successfully!", isSuccess = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something went wrong. " + ex.Message, isSuccess = false });
            }
        }
    }
}
