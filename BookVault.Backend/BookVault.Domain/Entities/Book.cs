using System.Text.Json;

namespace BookVault.Models
{
    public sealed class Book : EntityBase
    {
        public string Name { get; private set; }
        public List<string> Genres { get; private set; } = new();
        public DateTimeOffset? ReleaseDate { get; private set; }
        public string Author { get; private set; }
        public string Plot { get; private set; }
        public int? Length { get; private set; } // Number of pages
        public bool IsRead { get; private set; }
        public string? ReadUrl { get; private set; }
        public string CoverImagePath { get; private set; }
        public string PdfFilePath { get; private set; }

        // Private constructor for ORM frameworks
        // Private parameterless constructor for EF Core
        private Book()
        {
            Name = string.Empty;
            Genres = new List<string>();
            Author = string.Empty;
            Plot = string.Empty;
            ReadUrl = string.Empty;
            CoverImagePath = string.Empty;
            PdfFilePath = string.Empty;
        }

        // Private constructor used by the factory method
        private Book(string name, List<string> genres, DateTimeOffset? releaseDate, string author,
                    string plot, int? length, bool isRead, string? readUrl,
                    string coverImagePath, string pdfFilePath)
        {
            Name = name;
            Genres = genres ?? new List<string>();
            ReleaseDate = releaseDate;
            Author = author;
            Plot = plot;
            Length = length;
            IsRead = isRead;
            ReadUrl = readUrl;
            CoverImagePath = coverImagePath;
            PdfFilePath = pdfFilePath;
        }

        // Static factory method
        public static Book Create(string name, List<string> genres, DateTimeOffset? releaseDate,
                                 string author, string plot, int? length, bool isRead,
                                 string? readUrl, string coverImagePath, string pdfFilePath)
        {
            ValidateInputs(name, releaseDate, readUrl, length);
            return new Book(name, genres, releaseDate, author, plot, length, isRead,
                          readUrl, coverImagePath, pdfFilePath);
        }

        // Update method (for modifying the object after creation)
        public void Update(string name, List<string> genres, DateTimeOffset? releaseDate,
                          string author, string plot, int? length, bool isRead,
                          string? readUrl, string coverImagePath, string pdfFilePath)
        {
            ValidateInputs(name, releaseDate, readUrl, length);

            Name = name;
            Genres = genres ?? new List<string>();
            ReleaseDate = releaseDate;
            Author = author;
            Plot = plot;
            Length = length;
            IsRead = isRead;
            ReadUrl = readUrl;
            CoverImagePath = coverImagePath;
            PdfFilePath = pdfFilePath;

            UpdateLastModified();
        }

        // Validation logic
        private static void ValidateInputs(string name, DateTimeOffset? releaseDate,string? readUrl, int? length)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name cannot be null or empty.", nameof(name));

            if (releaseDate.HasValue && releaseDate > DateTimeOffset.UtcNow)
                throw new ArgumentException("Release date cannot be in the future.", nameof(releaseDate));

            if (length.HasValue && length <= 0)
                throw new ArgumentException("Length must be a positive number.", nameof(length));

            // Validate URL format if provided
            if (!string.IsNullOrWhiteSpace(readUrl) && !Uri.TryCreate(readUrl, UriKind.Absolute, out _))
                throw new ArgumentException("Read URL must be a valid URL.", nameof(readUrl));
        }
    }
}