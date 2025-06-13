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
        public async Task<IActionResult> GetThumbnail(string filename)
        {
            if (string.IsNullOrWhiteSpace(filename))
                return BadRequest("Filename is required.");

            var (isSuccess, imageBytes, message) = await _thumbnailService.GenerateThumbnailAsync(filename);

            if (!isSuccess)
            {
                _logger.LogWarning("Thumbnail generation failed for {filename}: {message}", filename, message);
                return NotFound(message);
            }

            return File(imageBytes, "image/png");
        }
    }
}