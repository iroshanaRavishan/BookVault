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
    public class NoteConfiguration : IEntityTypeConfiguration<Note>
    {
        public void Configure(EntityTypeBuilder<Note> builder)
        {
            builder.ToTable("Notes");

            builder.HasKey(n => n.Id);

            builder.Property(n => n.UserId)
                   .IsRequired();

            builder.Property(n => n.BookId)
                   .IsRequired();

            builder.Property(n => n.PageNumber)
                   .IsRequired();

            builder.Property(n => n.Content)
                   .HasMaxLength(5000) // content limit
                   .IsRequired(false); // content can be null

            builder.Property(n => n.CreatedAt)
                   .IsRequired();

            builder.Property(n => n.UpdatedAt)
                   .IsRequired();

            // Prevent duplicate notes for same user/book/page
            builder.HasIndex(n => new { n.UserId, n.BookId, n.PageNumber })
                   .IsUnique();
        }
    }
}
