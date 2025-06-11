using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Domain.Interfaces
{
    public interface IPdfThumbnailRepository
    {
        Task<byte[]> GenerateThumbnailAsync(string filename);
    }
}
