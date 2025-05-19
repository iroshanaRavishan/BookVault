namespace BookVault.DTOs
{
    public record CreateBookDto(string Name, string Genre, DateTimeOffset ReleaseDate, double Rating);
}
