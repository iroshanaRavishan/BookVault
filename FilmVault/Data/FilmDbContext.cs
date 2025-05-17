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
    }
}
