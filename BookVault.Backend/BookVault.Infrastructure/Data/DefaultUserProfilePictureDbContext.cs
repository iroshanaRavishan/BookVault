using BookVault.Domain.Entities;
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
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(DefaultUserProfilePictureDbContext).Assembly);
            base.OnModelCreating(modelBuilder);
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder
                .UseAsyncSeeding(async (context, _, cancellationToken) =>
                {
                    var defaultPic = await context.Set<DefaultUserProfilePicture>()
                        .FirstOrDefaultAsync(p => p.FileName == "default-user.png", cancellationToken);

                    if (defaultPic == null)
                    {
                        var bytes = await File.ReadAllBytesAsync("BookVault/BookVault.Backend/BookVault/Default images/default-user.png", cancellationToken);

                        defaultPic = new DefaultUserProfilePicture
                        {
                            FileName = "default-user.png",
                            ContentType = "image/png",
                            Data = bytes
                        };

                        await context.Set<DefaultUserProfilePicture>().AddAsync(defaultPic, cancellationToken);
                        await context.SaveChangesAsync(cancellationToken);
                    }
                })
                .UseSeeding((context, _) =>
                {
                    var defaultPic = context.Set<DefaultUserProfilePicture>()
                        .FirstOrDefault(p => p.FileName == "default-user.png");

                    if (defaultPic == null)
                    {
                        var bytes = File.ReadAllBytes("BookVault/BookVault.Backend/BookVault/Default images/default-user.png");

                        defaultPic = new DefaultUserProfilePicture
                        {
                            FileName = "default-user.png",
                            ContentType = "image/png",
                            Data = bytes
                        };

                        context.Set<DefaultUserProfilePicture>().Add(defaultPic);
                        context.SaveChanges();
                    }
                });
        }

    }
}
