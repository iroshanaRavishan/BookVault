using BookVault.Application.DTOs.BookDTOs;

namespace BookVault.Application.Services
{
    public interface IBookService
    {
        Task<BookDto> CreateBookAsync(CreateBookDto command);
        Task<BookDto?> GetBookByIdAsync(Guid id);
        Task<IEnumerable<BookDto>> GetAllBooksAsync();
        Task UpdateBookAsync(Guid id, UpdateBookDto command);
        Task DeleteBookAsync(Guid id);
    }
}
