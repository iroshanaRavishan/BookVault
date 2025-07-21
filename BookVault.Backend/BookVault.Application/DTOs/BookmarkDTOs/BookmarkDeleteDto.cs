using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application.DTOs.BookmarkDTOs
{
    public class BookmarkDeleteDto
    {
        public Guid Id { get; set; }
        public bool IsLastBookmark { get; set; }
    }
}
