using BookVault.Domain.Entities;
using BookVault.Infrastructure.Data.Configurations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Infrastructure.Data
{
    public class AppearanceDbContext(DbContextOptions<AppearanceDbContext> options) : DbContext(options)
    {
        public DbSet<Appearance> Appearances => Set<Appearance>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("app");

            // Apply the Appearance configuration
            modelBuilder.ApplyConfiguration(new AppearanceConfiguration());

            base.OnModelCreating(modelBuilder);
        }
    }
}
