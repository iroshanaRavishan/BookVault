using BookVault.Application.Interfaces;
using BookVault.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.Services
{
    public class PdfThumbnailService : IPdfThumbnailService
    {
        private readonly IPdfThumbnailRepository _repository;
        private readonly ILogger<PdfThumbnailService> _logger;

        public PdfThumbnailService(IPdfThumbnailRepository repository, ILogger<PdfThumbnailService> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        public async Task<(bool IsSuccess, string? ThumbnailPath, string Message)> GenerateThumbnailAsync(string filename, string type, int page)
        {
            try
            {
                var thumbnailPath = await _repository.GenerateThumbnailAsync(filename, type, page);

                if (string.IsNullOrEmpty(thumbnailPath))
                {
                    return (false, null, "Failed to generate thumbnail. File may not exist or is unreadable.");
                }

                return (true, thumbnailPath, "Thumbnail generated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating thumbnail for file {Filename}: {Message}", filename, ex.Message);
                return (false, null, "Internal server error.");
            }
        }
    }
}
