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
        }
    }
}
