using BookVault.Application.DTOs.BookDTOs;
using BookVault.Application.DTOs.BookmarkDTOs;
using BookVault.Application.Interfaces;
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

        // GET: api/bookmarks?userId={userId}&bookId={bookId}&sortBy={sortBy}
        // Available sortBy values: "newest", "oldest", "page-asc", "page-desc"
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookmarkResponseDto>>> GetAll([FromQuery] Guid userId, [FromQuery] Guid bookId, [FromQuery] string sortBy = "page-asc")
        {
            var bookmarks = await _bookmarkService.GetAllAsync(userId, bookId, sortBy);

            var result = bookmarks.Select(b => new BookmarkResponseDto
            {
                Id = b.Id,
                UserId = b.UserId,
                BookId = b.BookId,
                PageNumber = b.PageNumber,
                Color = b.Color,
                CreatedAt = b.CreatedAt,
                BookmarkThumbnailPath = b.BookmarkThumbnailPath
            });

            return Ok(result);
        }

        // POST: api/bookmarks
        [HttpPost]
        public async Task<ActionResult<BookmarkResponseDto>> Create([FromBody] BookmarkCreateDto dto)
        {
            var bookmark = await _bookmarkService.CreateAsync(dto);

            var response = new BookmarkResponseDto
            {
                Id = bookmark.Id,
                UserId = bookmark.UserId,
                BookId = bookmark.BookId,
                PageNumber = bookmark.PageNumber,
                Color = bookmark.Color,
                CreatedAt = bookmark.CreatedAt,
                BookmarkThumbnailPath = bookmark.BookmarkThumbnailPath
            };

            return CreatedAtAction(nameof(GetAll), new { userId = response.UserId, bookId = response.BookId }, response);
        }

        // DELETE: api/bookmarks
        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] BookmarkDeleteDto dto)
        {
            var success = await _bookmarkService.DeleteAsync(dto.Id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
