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

        [HttpGet("all-with-data")]
        public async Task<IActionResult> GetAllImagesWithData()
        {
            var images = await _defaultUserProfilePictureService.GetAllImagesWithDataAsync();
            return Ok(images);
        }

        [HttpGet("{id}/file")]
        public async Task<IActionResult> GetImageFile(Guid id)
        {
            var image = await _defaultUserProfilePictureService.GetImageByIdAsync(id);

            if (image == null)
                return NotFound();

            return File(image.Data, image.ContentType, image.FileName);
        }

        [HttpGet("all-image-data")]
        public async Task<IActionResult> GetAllImageData()
        {
            var imageDataList = await _defaultUserProfilePictureService.GetAllImageDataAsync();

            // Convert byte arrays to base64 strings for frontend consumption
            var base64Images = imageDataList.Select(data => Convert.ToBase64String(data));

            return Ok(base64Images);
        }

        [HttpGet("{id}/data")]
        public async Task<IActionResult> GetImageData(Guid id)
        {
            var imageData = await _defaultUserProfilePictureService.GetImageDataByIdAsync(id);
            if (imageData == null)
                return NotFound();

            // Optional: Fetch the content type from another method if needed
            var image = await _defaultUserProfilePictureService.GetImageByIdAsync(id);
            var contentType = image?.ContentType ?? "application/octet-stream";

            return File(imageData, contentType); // returns image binary as file
        }

        // this is to delete the default images and this will not be used by the users of the application
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImage(Guid id)
        {
            var deleted = await _defaultUserProfilePictureService.DeleteImageAsync(id);

            if (!deleted)
                return NotFound(new { message = $"Image with ID {id} not found." });

            return NoContent(); // 204 No Content
        }
    }
}
