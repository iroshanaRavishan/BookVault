using BookVault.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookVault.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PdfThumbnailController : ControllerBase
    {
        private readonly IPdfThumbnailService _thumbnailService;
        private readonly ILogger<PdfThumbnailController> _logger;

        public PdfThumbnailController(IPdfThumbnailService thumbnailService, ILogger<PdfThumbnailController> logger)
        {
            _thumbnailService = thumbnailService;
            _logger = logger;
        }

        [HttpGet("{filename}")]
        public async Task<IActionResult> GetThumbnail(string filename, string type, [FromQuery] int page = 0)
        {
            if (string.IsNullOrWhiteSpace(filename))
                return BadRequest("Filename is required.");

            var (isSuccess, thumbnailPath, message) = await _thumbnailService.GenerateThumbnailAsync(filename, type, page);

            if (!isSuccess || thumbnailPath == null)
            {
                _logger.LogWarning("Thumbnail generation failed for {filename} (page {page}): {message}", filename, page, message);
                return NotFound(message);
            }

            // Return just the path so the frontend can access /thumbnails/xyz.png
            return Ok(new { thumbnailPath });
        }
    }
}