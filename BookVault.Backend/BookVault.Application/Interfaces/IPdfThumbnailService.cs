using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.Interfaces
{
    public interface IPdfThumbnailService
    {
        Task<(bool IsSuccess, byte[] ImageBytes, string Message)> GenerateThumbnailAsync(string filename);
    }
}
