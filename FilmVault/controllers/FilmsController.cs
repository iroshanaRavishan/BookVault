using BookVault.DTOs;
using BookVault.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookVault.controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;
        private readonly ILogger<BooksController> _logger;

        public BooksController(IBookService bookService, ILogger<BooksController> logger)
        {
            _bookService = bookService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetAll()
        {
            var books = await _bookService.GetAllBooksAsync();
            return Ok(books);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<BookDto>> GetById(Guid id)
        {
            var book = await _bookService.GetBookByIdAsync(id);
            if (book is null)
                return NotFound($"Book with id {id} not found.");
            return Ok(book);
        }

        [HttpPost]
        public async Task<ActionResult<BookDto>> Create([FromBody] CreateBookDto dto)
        {
            var createdBook = await _bookService.CreateBookAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdBook.Id }, createdBook);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBookDto dto)
        {
            try
            {
                await _bookService.UpdateBookAsync(id, dto);
                return NoContent();
            }
            catch (ArgumentNullException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _bookService.DeleteBookAsync(id);
            return NoContent();
        }
    }
}
