using FilmVault.Models;
using Microsoft.EntityFrameworkCore;

namespace FilmVault.Data
{
    public class FilmDbContext(DbContextOptions<FilmDbContext> options) : DbContext(options)
    {
        public DbSet<Film> Films => Set<Film>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("app");
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(FilmDbContext).Assembly);
            base.OnModelCreating(modelBuilder);
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder
                .UseAsyncSeeding(async (context, _, cancellationToken) =>
                {
                    var sampleFilm = await context.Set<Film>().FirstOrDefaultAsync(b => b.Name == "Harry Potter 12");
                    if (sampleFilm == null)
                    {
                        sampleFilm = Film.Create("Harry Potter 12", "Fantasy", new DateTimeOffset(new DateTime(2025, 1, 3), TimeSpan.Zero), 7);
                        await context.Set<Film>().AddAsync(sampleFilm);
                        await context.SaveChangesAsync();
                    }
                })
                .UseSeeding((context, _) =>
                {
                    var sampleFilm = context.Set<Film>().FirstOrDefault(b => b.Name == "Harry Potter 12");
                    if (sampleFilm == null)
                    {
                        sampleFilm = Film.Create("Harry Potter 12", "Fantasy", new DateTimeOffset(new DateTime(2025, 1, 3), TimeSpan.Zero), 7);
                        context.Set<Film>().Add(sampleFilm);
                        context.SaveChanges();
                    }
                });
        }
    }
}
