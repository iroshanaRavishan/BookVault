using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.Linq;
using System.Text;
using PdfiumViewer;

namespace BookVault.Shared
{
    public static class PdfThumbnailHelper
    {
        public static string GenerateThumbnail(string pdfPath, string thumbnailsDir, string type, int page = 0, int width = 200, int height = 200)
        {
            using var stream = File.OpenRead(pdfPath);
            using var pdfDocument = PdfDocument.Load(stream);
            using var image = pdfDocument.Render(page, width, height, true);

            string thumbnailFilename = Path.GetFileNameWithoutExtension(pdfPath) + $"-{type}.png";
            string thumbnailPath = Path.Combine(thumbnailsDir, thumbnailFilename);

            image.Save(thumbnailPath, ImageFormat.Png);

            // Return the relative path to store in DB or send to frontend
            return Path.Combine($"{type}s", thumbnailFilename);
        }
    }
}
