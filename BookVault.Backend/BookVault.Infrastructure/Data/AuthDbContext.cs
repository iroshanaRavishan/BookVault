using BookVault.Data;
using BookVault.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Infrastructure.Data
{
    public class AuthDbContext(DbContextOptions<AuthDbContext> options): IdentityDbContext<User>(options)
    {
        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("app");
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AuthDbContext).Assembly);
            base.OnModelCreating(modelBuilder);

            // Seed Admin User
            var adminId = Guid.NewGuid().ToString();
            var hasher = new PasswordHasher<User>();

            var adminUser = new User
            {
                Id = adminId,
                UserName = "admin@bookvault.com",
                NormalizedUserName = "ADMIN@BOOKVAULT.COM",
                Email = "admin@bookvault.com",
                NormalizedEmail = "ADMIN@BOOKVAULT.COM",
                EmailConfirmed = true,
                Name = "Super Admin",
                IsAdmin = true,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow,
                LastLogin = DateTime.UtcNow,
                SecurityStamp = Guid.NewGuid().ToString("D")
            };
            adminUser.PasswordHash = hasher.HashPassword(adminUser, "Admin@123");

            modelBuilder.Entity<User>().HasData(adminUser);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder
            .UseAsyncSeeding(async (context, _, cancellationToken) =>
            {
                var userManager = context.GetService<UserManager<User>>();
                var user = await userManager.FindByEmailAsync("admin@bookvault.com");

                if (user == null)
                {
                    var adminUser = new User
                    {
                        UserName = "admin@bookvault.com",
                        Email = "admin@bookvault.com",
                        EmailConfirmed = true,
                        Name = "Super Admin",
                        IsAdmin = true
                    };
                    await userManager.CreateAsync(adminUser, "Admin@123");
                }
            })
            .UseSeeding((context, _) =>
            {
                var user = context.Set<User>().FirstOrDefault(u => u.Email == "admin@bookvault.com");
                if (user == null)
                {
                    var hasher = new PasswordHasher<User>();
                    var adminUser = new User
                    {
                        Id = Guid.NewGuid().ToString(),
                        UserName = "admin@bookvault.com",
                        NormalizedUserName = "ADMIN@BOOKVAULT.COM",
                        Email = "admin@bookvault.com",
                        NormalizedEmail = "ADMIN@BOOKVAULT.COM",
                        EmailConfirmed = true,
                        Name = "Super Admin",
                        IsAdmin = true,
                        CreatedDate = DateTime.UtcNow,
                        ModifiedDate = DateTime.UtcNow,
                        LastLogin = DateTime.UtcNow,
                        SecurityStamp = Guid.NewGuid().ToString("D"),
                    };
                    adminUser.PasswordHash = hasher.HashPassword(adminUser, "Admin@123");
                    context.Set<User>().Add(adminUser);
                    context.SaveChanges();
                }
            });
        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<User>())
            {
                if (entry.State == EntityState.Modified)
                {
                    entry.Entity.ModifiedDate = DateTime.UtcNow;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
