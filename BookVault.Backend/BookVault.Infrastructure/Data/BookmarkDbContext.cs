using BookVault.Domain.Entities;
using BookVault.Infrastructure.Data.Configurations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Infrastructure.Data
{
    public class BookmarkDbContext(DbContextOptions<BookmarkDbContext> options) : DbContext(options)
    {
        public DbSet<Bookmark> Bookmarks => Set<Bookmark>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("app");

            // Apply the Bookmark configuration
            modelBuilder.ApplyConfiguration(new BookmarkConfiguration());

            base.OnModelCreating(modelBuilder);
        }
    }
}
