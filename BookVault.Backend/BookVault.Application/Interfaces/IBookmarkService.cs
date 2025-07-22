using BookVault.Application.DTOs.BookDTOs;
using BookVault.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.Interfaces
{
    public interface IBookmarkService
    {
        Task<IEnumerable<BookmarkResponseDto>> GetAllAsync(Guid userId, Guid bookId, string sortBy);
        Task<BookmarkResponseDto> CreateAsync(BookmarkCreateDto dto);
        Task<bool> DeleteAsync(Guid bookmarkId, bool isLastBookmark);
    }
}