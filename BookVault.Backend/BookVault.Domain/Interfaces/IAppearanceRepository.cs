using BookVault.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Domain.Interfaces
{
    public interface IAppearanceRepository
    {
        Task<Appearance?> GetByIdAsync(Guid id);
        Task<IEnumerable<Appearance>> GetAllAsync();
        Task AddAsync(Appearance appearance);
        Task UpdateAsync(Appearance appearance);
        Task DeleteAsync(Appearance appearance);
        Task SaveChangesAsync();
    }
}
