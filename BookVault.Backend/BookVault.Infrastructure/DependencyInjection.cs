using BookVault.Data;
using BookVault.Domain.Interfaces;
using BookVault.Infrastructure.Data;
using BookVault.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            // Register DbContext
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<BookDbContext>(options =>
                options.UseNpgsql(connectionString, b => b.MigrationsAssembly(typeof(BookDbContext).Assembly.FullName)));

            services.AddDbContext<DefaultUserProfilePictureDbContext>(options =>
                options.UseNpgsql(connectionString, d => d.MigrationsAssembly(typeof(DefaultUserProfilePictureDbContext).Assembly.FullName)));


            // Register repositories
            services.AddScoped<IBookRepository, BookRepository>();
            services.AddScoped<IDefaultUserProfilePictureRepository, DefaultUserProfilePictureRepository>();

            return services;
        }
    }
}
