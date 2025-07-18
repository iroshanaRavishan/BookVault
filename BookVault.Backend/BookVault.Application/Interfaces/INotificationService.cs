using BookVault.Application.DTOs.BookDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.Interfaces
{
    public interface INotificationService
    {
        Task NotifyBookmarkCreatedAsync(BookmarkResponseDto bookmark);
    }
}
