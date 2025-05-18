namespace BookVault.DTOs
{
    public record UpdateBookDto(string Name, string Genre, DateTimeOffset ReleaseDate, double Rating);
}
