namespace FilmVault.DTOs
{
    public record FilmDto(Guid Id, string Title, string Genre, DateTimeOffset ReleaseDate, double Rating);
}
