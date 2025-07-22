using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Domain.Interfaces
{
    public interface IPdfThumbnailRepository
    {
        Task<string> GenerateThumbnailAsync(string filename, string type, int page);
    }
}
