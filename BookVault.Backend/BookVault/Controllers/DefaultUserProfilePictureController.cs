using BookVault.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookVault.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DefaultUserProfilePictureController : ControllerBase
    {
        private readonly IDefaultUserProfilePictureRepository _defaultUserProfilePictureService;
        public DefaultUserProfilePictureController(IDefaultUserProfilePictureRepository defaultUserProfilePictureService)
        {
            _defaultUserProfilePictureService = defaultUserProfilePictureService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            try
            {
                var imageId = await _defaultUserProfilePictureService.UploadImageAsync(file);
                return Ok(new { imageId });
            }
            catch (ArgumentException e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllImages()
        {
            var images = await _defaultUserProfilePictureService.GetAllImagesAsync();
            return Ok(images);
        }
    }
}
