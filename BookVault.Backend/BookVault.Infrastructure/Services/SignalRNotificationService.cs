using BookVault.Application.DTOs.BookDTOs;
using BookVault.Application.Interfaces;
using BookVault.Domain.Entities;
using BookVault.RealTimeNotification;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BookVault.Infrastructure.Services
{
    namespace BookVault.Infrastructure.Services
    {
        public class SignalRNotificationService : INotificationService
        {
            private readonly IHubContext<NotificationHub> _hubContext;

            public SignalRNotificationService(IHubContext<NotificationHub> hubContext)
            {
                _hubContext = hubContext;
            }

            public async Task NotifyBookmarkCreatedAsync(BookmarkResponseDto bookmark)
            {
                await _hubContext.Clients.All.SendAsync("BookmarkCreated", bookmark);
            }

            public async Task NotifyBookmarkDeletedAsync(Guid bookmarkId)
            {
                await _hubContext.Clients.All.SendAsync("BookmarkDeleted", bookmarkId);
            }
        }
    }
}
