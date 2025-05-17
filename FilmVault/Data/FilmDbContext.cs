using BookVault.Models;
using Microsoft.EntityFrameworkCore;

namespace BookVault.Data
{
    public class BookDbContext(DbContextOptions<BookDbContext> options) : DbContext(options)
    {
        public DbSet<Book> Books => Set<Book>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("app");
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(BookDbContext).Assembly);
            base.OnModelCreating(modelBuilder);
        }
    }
}
