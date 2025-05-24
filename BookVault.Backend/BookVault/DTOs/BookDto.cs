namespace BookVault.DTOs
{
    public record BookDto(
        Guid Id,
        string Name,
        string Genre,
        DateTimeOffset? ReleaseDate,
        string Author,
        string Plot,
        int? Length,
        bool IsRead,
        string ReadUrl,
        string CoverImagePath,
        string PdfFilePath,
        DateTimeOffset Created,
        DateTimeOffset LastModified);
}