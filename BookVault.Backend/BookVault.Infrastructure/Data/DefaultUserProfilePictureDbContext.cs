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
    public class DefaultUserProfilePictureDbContext(DbContextOptions<DefaultUserProfilePictureDbContext> options)
        : DbContext(options)
    {
        public DbSet<DefaultUserProfilePicture> DefaultUserProfilePictures => Set<DefaultUserProfilePicture>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("app");
            modelBuilder.ApplyConfiguration(new DefaultUserProfilePictureConfiguration());
            base.OnModelCreating(modelBuilder);
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // for async-compatible environments (like During runtime initialization via code), runs asynchronously
            optionsBuilder
            .UseAsyncSeeding(async (context, _, cancellationToken) =>
            {
                var imageFileNames = new[]
                {
                    "default-user1.png",
                    "default-user2.png",
                    "default-user3.png",
                    "default-user4.png",
                    "default-user5.png",
                    "default-user6.png",
                    "default-user7.png",
                    "default-user8.png",
                    "default-user9.png"
                };

                foreach (var fileName in imageFileNames)
                {
                    var existing = await context.Set<DefaultUserProfilePicture>()
                        .FirstOrDefaultAsync(p => p.FileName == fileName, cancellationToken);

                    if (existing != null)
                        continue;

                    var filePath = Path.Combine("Default images", fileName);
                    if (!File.Exists(filePath))
                        continue;

                    var bytes = await File.ReadAllBytesAsync(filePath, cancellationToken);

                    var picture = DefaultUserProfilePicture.Create(
                        fileName,
                        "image/png",
                        bytes
                    );

                    await context.Set<DefaultUserProfilePicture>().AddAsync(picture, cancellationToken);
                }

                await context.SaveChangesAsync(cancellationToken);
            })

            // for sync environments (tools that don’t support async methods),  runs synchronously
            .UseSeeding((context, _) =>
            {
                var imageFileNames = new[]
                {
                    "default-user1.png",
                    "default-user2.png",
                    "default-user3.png",
                    "default-user4.png",
                    "default-user5.png",
                    "default-user6.png",
                    "default-user7.png",
                    "default-user8.png",
                    "default-user9.png"
                };

                foreach (var fileName in imageFileNames)
                {
                    var existing = context.Set<DefaultUserProfilePicture>()
                        .FirstOrDefault(p => p.FileName == fileName);

                    if (existing != null)
                        continue;

                    var filePath = Path.Combine("Default images", fileName);
                    if (!File.Exists(filePath))
                        continue;

                    var bytes = File.ReadAllBytes(filePath);

                    var picture = DefaultUserProfilePicture.Create(
                        fileName,
                        "image/png",
                        bytes
                    );

                    context.Set<DefaultUserProfilePicture>().Add(picture);
                }

                context.SaveChanges();
            });

        }

    }
}
