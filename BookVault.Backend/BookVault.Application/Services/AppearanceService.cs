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
            return entity == null ? null : MapToReadDto(entity);
        }

        public async Task<IEnumerable<AppearanceReadDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return entities.Select(MapToReadDto);
        }

        public async Task<AppearanceReadDto> CreateAsync(AppearanceCreateDto dto)
        {

            var appearance = Appearance.Create(
                dto.UserId,
                dto.Color,
                dto.MarginEnabled,
                dto.Brightness,
                dto.IsDarkTheme,
                dto.IsDimmed,
                dto.IsFocusMode,
                dto.IsAutoThemeEnabled,
                dto.FromTime,
                dto.ToTime
            );

            await _repository.AddAsync(appearance);
            await _repository.SaveChangesAsync();

            return MapToReadDto(appearance);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var appearance = await _repository.GetByIdAsync(id);
            if (appearance == null) return false;

            await _repository.DeleteAsync(appearance);
            await _repository.SaveChangesAsync();
            return true;
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
                IsDarkTheme = entity.IsDarkTheme,
                IsDimmed = entity.IsDimmed,
                IsFocusMode = entity.IsFocusMode,
                IsAutoThemeEnabled = entity.IsAutoThemeEnabled,
                FromTime = entity.FromTime,
                ToTime = entity.ToTime,
                CreatedAt = entity.Created,
                LastModified = entity.LastModified
            };
        }
    }
}
