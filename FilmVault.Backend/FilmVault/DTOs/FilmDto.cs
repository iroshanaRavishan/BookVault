namespace FilmVault.DTOs
{
    public record FilmDto(Guid Id, string Name, string Genre, DateTimeOffset ReleaseDate, double Rating);
}
