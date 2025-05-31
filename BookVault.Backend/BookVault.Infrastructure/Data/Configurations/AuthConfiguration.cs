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
    public class AuthConfiguration :IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");

            builder.Property(u => u.Name)
                   .HasMaxLength(50)
                   .IsRequired();

            builder.Property(u => u.CreatedDate)
                   .IsRequired();

            builder.Property(u => u.ModifiedDate)
                   .IsRequired();

            builder.Property(u => u.LastLogin)
                   .IsRequired();

            builder.Property(u => u.IsAdmin)
                   .HasDefaultValue(false);

            builder.Property(u => u.ProfilePicture)
                   .HasColumnType("bytea")
                   .IsRequired(false); // Allow null if no image is uploaded

            builder.Property(u => u.ProfilePictureContentType)
                   .HasMaxLength(100)
                   .IsRequired(false);
        }
    }
}
