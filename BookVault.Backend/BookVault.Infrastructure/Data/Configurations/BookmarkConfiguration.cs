using BookVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Infrastructure.Data.Configurations
{
    public class BookmarkConfiguration : IEntityTypeConfiguration<Bookmark>
    {
        public void Configure(EntityTypeBuilder<Bookmark> builder)
        {
            builder.ToTable("Bookmarks");

            builder.HasKey(b => b.Id);

            builder.Property(b => b.UserId)
                   .IsRequired();

            builder.Property(b => b.BookId)
                   .IsRequired();

            builder.Property(b => b.PageNumber)
                   .IsRequired();

            builder.Property(b => b.Color)
                    .IsRequired();

            builder.Property(b => b.CreatedAt)
                   .IsRequired();

            builder.Property(b => b.BookmarkThumbnailPath)
                   .HasMaxLength(500)
                   .IsRequired(false);

            builder.HasIndex(b => new { b.UserId, b.BookId, b.PageNumber })
                   .IsUnique(); // Prevent duplicate bookmarks for the same user/book/page
        }
    }
}
