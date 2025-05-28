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
                        // Updated Create method call with genres as List<string>
                        sampleBook = Book.Create(
                            name: "Harry Potter 12-i",
                            genres: new List<string> { "Fantasy", "Adventure", "Young Adult" },
                            releaseDate: new DateTimeOffset(new DateTime(2025, 1, 3), TimeSpan.Zero),
                            author: "J.K. Rowling",
                            plot: "The continuing adventures of Harry Potter in his 12th year.",
                            length: 450,
                            isRead: false,
                            readUrl: "https://example.com/harrypotter12",
                            coverImagePath: "",
                            pdfFilePath: ""
                        );
                        await context.Set<Book>().AddAsync(sampleBook);
                        await context.SaveChangesAsync();
                    }
                })
                .UseSeeding((context, _) =>
                {
                    var sampleBook = context.Set<Book>().FirstOrDefault(b => b.Name == "Harry Potter 12-i");
                    if (sampleBook == null)
                    {
                        // Updated Create method call with genres as List<string>
                        sampleBook = Book.Create(
                            name: "Harry Potter 12-i",
                            genres: new List<string> { "Fantasy", "Adventure", "Young Adult" },
                            releaseDate: new DateTimeOffset(new DateTime(2025, 1, 3), TimeSpan.Zero),
                            author: "J.K. Rowling",
                            plot: "The continuing adventures of Harry Potter in his 12th year.",
                            length: 450,
                            isRead: false,
                            readUrl: "https://example.com/harrypotter12",
                            coverImagePath: "",
                            pdfFilePath: ""
                        );
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