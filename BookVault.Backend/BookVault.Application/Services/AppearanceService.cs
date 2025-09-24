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
    }
}
