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

        public async Task<byte[]> GenerateThumbnailAsync(string filename)
        {
            string uploadsPath = Path.Combine(_env.ContentRootPath, "uploads", "pdfs");
            string filePath = Path.Combine(uploadsPath, filename);

            if (!File.Exists(filePath))
                return null;

            // PdfiumViewer is synchronous, so wrap in Task.Run to avoid blocking
            return await Task.Run(() =>
            {
                using var stream = File.OpenRead(filePath);
                using var pdfDocument = PdfDocument.Load(stream);
                using var image = pdfDocument.Render(0, 200, 200, true); // Render first page as 200x200 thumbnail

                using var ms = new NoTimeoutMemoryStream();
                image.Save(ms, ImageFormat.Png);
                return ms.ToArray();
            });
        }
    }
}