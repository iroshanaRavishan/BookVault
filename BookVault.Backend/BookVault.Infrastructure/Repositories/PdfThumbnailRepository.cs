using BookVault.Domain.Interfaces;
using BookVault.Infrastructure.Helpers;
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
                using var stream = File.OpenRead(filePath);
                using var pdfDocument = PdfDocument.Load(stream);
                using var image = pdfDocument.Render(0, 200, 200, true);

                // Save the thumbnail
                string thumbnailsDir = Path.Combine(_env.ContentRootPath, "uploads", "thumbnails");
                Directory.CreateDirectory(thumbnailsDir);

                string thumbnailFilename = Path.GetFileNameWithoutExtension(filename) + "-thumbnail.png";
                string thumbnailPath = Path.Combine(thumbnailsDir, thumbnailFilename);

                image.Save(thumbnailPath, ImageFormat.Png); // <--- This saves it to disk

                // Return the relative path to store in DB or send to frontend
                return Path.Combine("thumbnails", thumbnailFilename);
            });
        }
    }
}