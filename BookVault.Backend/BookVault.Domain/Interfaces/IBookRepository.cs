using BookVault.Models;

namespace BookVault.Domain.Interfaces
{
    public interface IBookRepository
    {
        // Query operations
        Task<IEnumerable<Book>> GetAllAsync();
        Task<Book?> GetByIdAsync(Guid id);
        Task<Book?> GetByTitleAsync(string title);
        Task<bool> ExistsAsync(Guid id);
        Task<int> CountAsync();

        // Command operations
        Task<Book> AddAsync(Book book);
        Task<Book> UpdateAsync(Book book);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> DeleteAsync(Book book);

        // Bulk operations
        Task<IEnumerable<Book>> AddRangeAsync(IEnumerable<Book> books);
        Task<bool> DeleteRangeAsync(IEnumerable<Guid> ids);

        // Search and filtering
        Task<IEnumerable<Book>> SearchAsync(string searchTerm);
        Task<IEnumerable<Book>> GetPagedAsync(int pageNumber, int pageSize);

        // Unit of Work pattern support
        Task<int> SaveChangesAsync();
    }
}