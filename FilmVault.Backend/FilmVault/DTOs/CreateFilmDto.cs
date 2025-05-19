namespace FilmVault.DTOs
{
    public record CreateFilmDto(string Name, string Genre, DateTimeOffset ReleaseDate, double Rating);
}
