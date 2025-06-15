using System.ComponentModel.DataAnnotations;

namespace BookVault.Application.DTOs.BookDTOs
{
    public class UpdateBookDto
    {
        [StringLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public string? Name { get; init; }

        // Changed to accept array of strings for genres
        public List<string>? Genres { get; init; }

        public DateTimeOffset? ReleaseDate { get; init; }

        [StringLength(200, ErrorMessage = "Author name cannot exceed 200 characters")]
        public string? Author { get; init; }

        [StringLength(2000, ErrorMessage = "Plot cannot exceed 2000 characters")]
        public string? Plot { get; init; }

        [Range(1, int.MaxValue, ErrorMessage = "Length must be a positive number")]
        public int? Length { get; init; }

        public bool? IsRead { get; init; }

        [Url(ErrorMessage = "Please provide a valid URL")]
        [StringLength(500, ErrorMessage = "URL cannot exceed 500 characters")]
        public string? ReadUrl { get; init; }

        [StringLength(500, ErrorMessage = "Cover image path cannot exceed 500 characters")]
        public string? CoverImagePath { get; init; }

        [StringLength(500, ErrorMessage = "Thumbnail path cannot exceed 500 characters")]
        public string? ThumbnailPath { get; init; }

        [StringLength(500, ErrorMessage = "PDF file path cannot exceed 500 characters")]
        public string? PdfFilePath { get; init; }
    }
}