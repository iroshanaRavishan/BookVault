using BookVault.Domain.Interfaces;
using BookVault.Infrastructure.Helpers;
using BookVault.Shared;
using Microsoft.AspNetCore.Hosting;  // for IWebHostEnvironment
using PdfiumViewer;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Threading.Tasks;

namespace BookVault.Infrastructure.Repositories
{
    public class PdfThumbnailRepository : IPdfThumbnailRepository
    {
        private readonly IWebHostEnvironment _env;

        public PdfThumbnailRepository(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> GenerateThumbnailAsync(string filename)
        {
            string uploadsPath = Path.Combine(_env.ContentRootPath, "uploads", "pdfs");
            string filePath = Path.Combine(uploadsPath, filename);

            if (!File.Exists(filePath))
                return null;

            return await Task.Run(() =>
            {
                string thumbnailsDir = Path.Combine(_env.ContentRootPath, "uploads", "thumbnails");
                Directory.CreateDirectory(thumbnailsDir);

                // Use helper to generate thumbnail (page 0 by default)
                return PdfThumbnailHelper.GenerateThumbnail(filePath, thumbnailsDir, 0);
            });
        }
    }
}