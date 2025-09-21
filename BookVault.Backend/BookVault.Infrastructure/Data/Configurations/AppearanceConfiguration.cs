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
    public class AppearanceConfiguration : IEntityTypeConfiguration<Appearance>
    {
        public void Configure(EntityTypeBuilder<Appearance> builder)
        {
            builder.ToTable("Appearances");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.UserId)
                    .IsRequired();

            builder.Property(a => a.Color)
                   .IsRequired()
                   .HasMaxLength(10);

            builder.Property(a => a.MarginEnabled)
                   .IsRequired();

            builder.Property(a => a.Brightness)
                   .IsRequired();

            builder.Property(a => a.IsDarkTheme)
                   .IsRequired();

            builder.Property(a => a.IsDimmed)
                   .IsRequired();

            builder.Property(a => a.IsFocusMode)
                   .IsRequired();
        }
    }
}
