using BookVault.Application.DTOs.AppearanceDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.Interfaces
{
    public interface IAppearanceService
    {
        Task<AppearanceReadDto?> GetByIdAsync(Guid id);
    }
}
