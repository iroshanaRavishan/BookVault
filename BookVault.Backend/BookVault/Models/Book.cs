namespace BookVault.Models
{
    public sealed class Book : EntityBase
    {
        public string Name { get; private set; }
        public string Genre { get; private set; }
        public DateTimeOffset? ReleaseDate { get; private set; }
        public string Author { get; private set; }
        public string Plot { get; private set; }
        public int? Length { get; private set; } // Number of pages
        public bool IsRead { get; private set; }
        public string ReadUrl { get; private set; }
        public string CoverImagePath { get; private set; }
        public string PdfFilePath { get; private set; }

        // Private constructor for ORM frameworks
        private Book()
        {
            Name = string.Empty;
            Genre = string.Empty;
            Author = string.Empty;
            Plot = string.Empty;
            ReadUrl = string.Empty;
            CoverImagePath = string.Empty;
            PdfFilePath = string.Empty;
        }

        private Book(string name, string genre, DateTimeOffset? releaseDate, string author,
                    string plot, int? length, bool isRead, string readUrl,
                    string coverImagePath, string pdfFilePath)
        {
            Name = name;
            Genre = genre;
            ReleaseDate = releaseDate;
            Author = author;
            Plot = plot;
            Length = length;
            IsRead = isRead;
            ReadUrl = readUrl;
            CoverImagePath = coverImagePath;
            PdfFilePath = pdfFilePath;
        }

        public static Book Create(string name, string genre, DateTimeOffset? releaseDate,
                                 string author, string plot, int? length, bool isRead,
                                 string readUrl, string coverImagePath, string pdfFilePath)
        {
            ValidateInputs(name, genre, releaseDate, author, readUrl, pdfFilePath, length);
            return new Book(name, genre, releaseDate, author, plot, length, isRead,
                          readUrl, coverImagePath, pdfFilePath);
        }

        public void Update(string name, string genre, DateTimeOffset? releaseDate,
                          string author, string plot, int? length, bool isRead,
                          string readUrl, string coverImagePath, string pdfFilePath)
        {
            ValidateInputs(name, genre, releaseDate, author, readUrl, pdfFilePath, length);

            Name = name;
            Genre = genre;
            ReleaseDate = releaseDate;
            Author = author;
            Plot = plot;
            Length = length;
            IsRead = isRead;
            ReadUrl = readUrl;
            CoverImagePath = coverImagePath;

            UpdateLastModified();
        }

        private static void ValidateInputs(string name, string genre, DateTimeOffset? releaseDate,
                                         string author, string readUrl, string pdfFilePath, int? length)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name cannot be null or empty.", nameof(name));

            if (releaseDate.HasValue && releaseDate > DateTimeOffset.UtcNow)
                throw new ArgumentException("Release date cannot be in the future.", nameof(releaseDate));

            if (length.HasValue && length <= 0)
                throw new ArgumentException("Length must be a positive number.", nameof(length));

            // At least one access method must be provided
            if (string.IsNullOrWhiteSpace(readUrl) && string.IsNullOrWhiteSpace(pdfFilePath))
                throw new ArgumentException("Either read URL or PDF file must be provided.");

            // Validate URL format if provided
            if (!string.IsNullOrWhiteSpace(readUrl) && !Uri.TryCreate(readUrl, UriKind.Absolute, out _))
                throw new ArgumentException("Read URL must be a valid URL.", nameof(readUrl));
        }
    }
}
