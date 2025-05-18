namespace BookVault.DTOs
{
    public record BookDto(Guid Id, string Name, string Genre, DateTimeOffset ReleaseDate, double Rating);
}
