﻿using BookVault.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookVault.Data.Configurations
{
    public class BookConfiguration : IEntityTypeConfiguration<Book>
    {
        public void Configure(EntityTypeBuilder<Book> builder)
        {
            // Defining the table name
            builder.ToTable("Books");

            // Set the primary key
            builder.HasKey(m => m.Id);

            // Configuring properties
            builder.Property(m => m.Name)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(m => m.Genre)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(m => m.ReleaseDate)
                   .IsRequired();

            builder.Property(m => m.Rating)
                   .IsRequired();

            // Configuring Created and LastModified properties to be handled as immutable and modifiable timestamps
            builder.Property(m => m.Created)
                   .IsRequired()
                   .ValueGeneratedOnAdd();

            builder.Property(m => m.LastModified)
                   .IsRequired()
                   .ValueGeneratedOnUpdate();

            // Optional: Adding index for better query performance
            builder.HasIndex(m => m.Name);
        }
    }
}