namespace BookVault.Application.DTOs.BookDTOs
{
    public record BookDto(
        Guid Id,
        string Name,
        List<string> Genres,
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