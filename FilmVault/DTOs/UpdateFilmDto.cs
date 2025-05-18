namespace FilmVault.DTOs
{
    public record UpdateFilmDto(string Name, string Genre, DateTimeOffset ReleaseDate, double Rating);
}
