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
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder
                .UseAsyncSeeding(async (context, _, cancellationToken) =>
                {
                    var sampleBook = await context.Set<Book>().FirstOrDefaultAsync(b => b.Name == "Harry Potter 12-i");
                    if (sampleBook == null)
                    {
                        sampleBook = Book.Create("Harry Potter 12-i", "Fantasy", new DateTimeOffset(new DateTime(2025, 1, 3), TimeSpan.Zero), 7);
                        await context.Set<Book>().AddAsync(sampleBook);
                        await context.SaveChangesAsync();
                    }
                })
                .UseSeeding((context, _) =>
                {
                    var sampleBook = context.Set<Book>().FirstOrDefault(b => b.Name == "Harry Potter 12-i");
                    if (sampleBook == null)
                    {
                        sampleBook = Book.Create("Harry Potter 12-i", "Fantasy", new DateTimeOffset(new DateTime(2025, 1, 3), TimeSpan.Zero), 7);
                        context.Set<Book>().Add(sampleBook);
                        context.SaveChanges();
                    }
                });
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<EntityBase>())
            {
                if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdateLastModified();
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }

    }
}
