namespace FilmVault.DTOs
{
    public record UpdateFilmDto(string Title, string Genre, DateTimeOffset ReleaseDate, double Rating);
}
