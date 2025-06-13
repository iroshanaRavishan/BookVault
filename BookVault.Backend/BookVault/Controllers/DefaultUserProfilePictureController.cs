using BookVault.Application.DTOs.DefaultProfilePictureDTOs;
using BookVault.Application.Interfaces;
using BookVault.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookVault.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DefaultUserProfilePictureController : ControllerBase
    {
        private readonly IDefaultUserProfilePictureService _defaultUserProfilePictureService;
        public DefaultUserProfilePictureController(IDefaultUserProfilePictureService defaultUserProfilePictureService)
        {
            _defaultUserProfilePictureService = defaultUserProfilePictureService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file uploaded.");

                using var ms = new MemoryStream();
                await file.CopyToAsync(ms);
                var fileBytes = ms.ToArray();
                var base64Data = Convert.ToBase64String(fileBytes);

                var uploadDto = new UploadDefaultUserProfilePictureDTO
                {
                    FileName = file.FileName,
                    ContentType = file.ContentType,
                    Base64Data = base64Data
                };

                var imageId = await _defaultUserProfilePictureService.UploadImageAsync(uploadDto);
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
            return Ok(images); // List<DefaultUserProfilePictureDTO>
        }

        [HttpGet("all-with-data")]
        public async Task<IActionResult> GetAllImagesWithData()
        {
            var images = await _defaultUserProfilePictureService.GetAllImagesWithDataAsync();
            return Ok(images); // List<DefaultUserProfilePictureWithDataDTO>
        }

        [HttpGet("{id}/file")]
        public async Task<IActionResult> GetImageFile(Guid id)
        {
            var imageDto = await _defaultUserProfilePictureService.GetImageByIdAsync(id);

            if (imageDto == null)
                return NotFound();

            var fileBytes = Convert.FromBase64String(imageDto.Base64Image);

            return File(fileBytes, imageDto.ContentType, imageDto.FileName);
        }

        [HttpGet("all-image-data")]
        public async Task<IActionResult> GetAllImageData()
        {
            var base64Images = await _defaultUserProfilePictureService.GetAllImageDataAsync();
            return Ok(base64Images); // List<string>
        }

        [HttpGet("{id}/data")]
        public async Task<IActionResult> GetImageData(Guid id)
        {
            var base64 = await _defaultUserProfilePictureService.GetImageDataByIdAsync(id);
            if (base64 == null)
                return NotFound();

            var bytes = Convert.FromBase64String(base64);
            var image = await _defaultUserProfilePictureService.GetImageByIdAsync(id);
            var contentType = image?.ContentType ?? "application/octet-stream";

            return File(bytes, contentType);
        }

        // this is to delete the default images and this will not be used by the users of the application
        // For admin/internal use
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
