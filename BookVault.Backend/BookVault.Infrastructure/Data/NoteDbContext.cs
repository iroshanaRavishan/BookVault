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
    public class NoteDbContext(DbContextOptions<NoteDbContext> options) : DbContext(options)
    {
        public DbSet<Note> Notes => Set<Note>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("app");

            // Apply the Note configuration
            modelBuilder.ApplyConfiguration(new NoteConfiguration());

            base.OnModelCreating(modelBuilder);
        }
    }
}
