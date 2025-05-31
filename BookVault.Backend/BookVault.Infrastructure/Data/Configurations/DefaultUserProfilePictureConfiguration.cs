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
    public class DefaultUserProfilePictureConfiguration : IEntityTypeConfiguration<DefaultUserProfilePicture>
    {
        public void Configure(EntityTypeBuilder<DefaultUserProfilePicture> builder)
        {
            builder.ToTable("DefaultUserProfilePictures");

            builder.HasKey(p => p.Id);
            
            // Disable DB generation for Guid ID
            builder.Property(p => p.Id)
                   .ValueGeneratedNever(); // Tells EF not to generate it via identity

            builder.Property(p => p.FileName)
                   .HasMaxLength(255)
                   .IsRequired();

            builder.Property(p => p.ContentType)
                   .HasMaxLength(100)
                   .IsRequired();

            builder.Property(p => p.Data)
                   .IsRequired();
        }
    }
}