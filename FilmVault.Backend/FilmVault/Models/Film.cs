namespace FilmVault.Models
{
    public sealed class Film : EntityBase
    {
        public string Name { get; private set; }
        public string Genre { get; private set; }
        public DateTimeOffset ReleaseDate { get; private set; }
        public double Rating { get; private set; }

        // Private constructor for ORM frameworks
        private Film()
        {
            Name = string.Empty;
            Genre = string.Empty;
        }
        private Film(string name, string genre, DateTimeOffset releaseDate, double rating)
        {
            Name = name;
            Genre = genre;
            ReleaseDate = releaseDate;
            Rating = rating;
        }

        public static Film Create(string name, string genre, DateTimeOffset releaseDate, double rating)
        {
            ValidateInputs(name, genre, releaseDate, rating);
            return new Film(name, genre, releaseDate, rating);
        }

        public void Update(string name, string genre, DateTimeOffset releaseDate, double rating)
        {
            ValidateInputs(name, genre, releaseDate, rating);

            Name = name;
            Genre = genre;
            ReleaseDate = releaseDate;
            Rating = rating;

            UpdateLastModified();
        }

        private static void ValidateInputs(string name, string genre, DateTimeOffset releaseDate, double rating)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name cannot be null or empty.", nameof(name));

            if (string.IsNullOrWhiteSpace(genre))
                throw new ArgumentException("Genre cannot be null or empty.", nameof(genre));

            if (releaseDate > DateTimeOffset.UtcNow)
                throw new ArgumentException("Release date cannot be in the future.", nameof(releaseDate));

            if (rating < 0 || rating > 10)
                throw new ArgumentException("Rating must be between 0 and 10.", nameof(rating));
        }
    }
}
