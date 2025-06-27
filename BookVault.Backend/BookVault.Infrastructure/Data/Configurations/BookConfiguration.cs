using BookVault.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json;

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

            // Configure Genres as JSON column for PostgreSQL
            builder.Property(m => m.Genres)
                   .HasConversion(
                       v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                       v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null) ?? new List<string>())
                   .HasColumnType("jsonb")
                   .IsRequired();

            // ReleaseDate is now nullable
            builder.Property(m => m.ReleaseDate);

            // Configure new properties
            builder.Property(m => m.Author)
                   .HasMaxLength(200);

            builder.Property(m => m.Plot)
                   .HasMaxLength(2000);

            builder.Property(m => m.Length);

            builder.Property(m => m.IsRead)
                   .IsRequired()
                   .HasDefaultValue(false);

            builder.Property(m => m.ReadUrl)
                   .HasMaxLength(500);

            builder.Property(m => m.CoverImagePath)
                   .HasMaxLength(500);

            builder.Property(m => m.ThumbnailPath)
                   .HasMaxLength(500)
                   .IsRequired(false);

            builder.Property(m => m.PdfFilePath)
                   .HasMaxLength(500);

            // Configuring Created and LastModified properties to be handled as immutable and modifiable timestamps
            builder.Property(m => m.Created)
                   .IsRequired()
                   .ValueGeneratedOnAdd();

            builder.Property(m => m.LastModified)
                   .IsRequired()
                   .ValueGeneratedOnUpdate();

            // Optional: Adding index for better query performance
            builder.HasIndex(m => m.Name);
            builder.HasIndex(m => m.Author);

            // Create GIN index for JSONB genres column for better search performance
            builder.HasIndex(m => m.Genres)
                   .HasMethod("gin");
        }
    }
}