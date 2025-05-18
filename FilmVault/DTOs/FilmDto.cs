namespace BookVault.DTOs
{
    public record BookDto(Guid Id, string Title, string Genre, DateTimeOffset ReleaseDate, double Rating);
}
