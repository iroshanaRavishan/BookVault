using BookVault.Application.DTOs.AppearanceDTOs;
using BookVault.Application.Interfaces;
using BookVault.Domain.Entities;
using BookVault.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.Services
{
    public class AppearanceService : IAppearanceService
    {
        private readonly IAppearanceRepository _repository;

        public AppearanceService(IAppearanceRepository repository)
        {
            _repository = repository;
        }

        public async Task<AppearanceReadDto?> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return entity == null ? null : new AppearanceReadDto
            {
                Id = entity.Id,
                Theme = entity.Theme,
                FontSize = entity.FontSize,
                LineHeight = entity.LineHeight,
                LetterSpacing = entity.LetterSpacing,
                MarginSize = entity.MarginSize
            };
        }

        // Manual mapping (instead of AutoMapper)
        private static AppearanceReadDto MapToReadDto(Appearance entity)
        {
            return new AppearanceReadDto
            {
                Id = entity.Id,
                UserId = entity.UserId,
                Color = entity.Color,
                MarginEnabled = entity.MarginEnabled,
                Brightness = entity.Brightness,
            };
        }
    }
}
