namespace BookVault.DTOs
{
    public record UpdateBookDto(string Title, string Genre, DateTimeOffset ReleaseDate, double Rating);
}
