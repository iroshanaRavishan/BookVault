using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookVault.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookmarkController : ControllerBase
    {
        private readonly IBookmarkService _bookmarkService;

        public BookmarkController(IBookmarkService bookmarkService)
        {
            _bookmarkService = bookmarkService;
        }

        // GET: api/bookmarks?userId={userId}&bookId={bookId}
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookmarkResponseDto>>> GetAll([FromQuery] Guid userId, [FromQuery] Guid bookId)
        {
            var bookmarks = await _bookmarkService.GetAllAsync(userId, bookId);

            var result = bookmarks.Select(b => new BookmarkResponseDto
            {
                Id = b.Id,
                UserId = b.UserId,
                BookId = b.BookId,
                PageNumber = b.PageNumber,
                CreatedAt = b.CreatedAt,
                BookmarkThumbnailPath = b.BookmarkThumbnailPath
            });

            return Ok(result);
        }
    }
}