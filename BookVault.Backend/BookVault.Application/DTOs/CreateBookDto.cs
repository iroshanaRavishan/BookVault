using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace BookVault.DTOs
{
    public class CreateBookDto
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public string Name { get; set; } = string.Empty;

        [StringLength(4, ErrorMessage = "Year should be 4 digits")]
        public string? Year { get; set; }

        // Changed to accept array of strings for genres
        public List<string>? Genres { get; set; } = new();

        [StringLength(200, ErrorMessage = "Author name cannot exceed 200 characters")]
        public string? Author { get; set; }

        [StringLength(2000, ErrorMessage = "Plot cannot exceed 2000 characters")]
        public string? Plot { get; set; }

        public string? Length { get; set; }

        public string Read { get; set; } = "false";

        [Url(ErrorMessage = "Please provide a valid URL")]
        [StringLength(500, ErrorMessage = "URL cannot exceed 500 characters")]
        public string? ReadUrl { get; set; }

        public IFormFile? CoverImage { get; set; }

        public IFormFile? PdfFile { get; set; }
    }
}