using BookVault.Data;
using BookVault.Domain.Entities;
using BookVault.Domain.Interfaces;
using BookVault.Infrastructure.Data;
using BookVault.Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
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
            
            services.AddDbContext<AuthDbContext>(options =>
                options.UseNpgsql(connectionString, u => u.MigrationsAssembly(typeof(AuthDbContext).Assembly.FullName)));

            // Register repositories
            services.AddScoped<IBookRepository, BookRepository>();
            services.AddScoped<IDefaultUserProfilePictureRepository, DefaultUserProfilePictureRepository>();
            services.AddIdentity<User, IdentityRole>(options =>
            {
                options.SignIn.RequireConfirmedAccount = true;
                options.Password.RequireDigit = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 0;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;
                options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvqxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._@";
                options.User.RequireUniqueEmail = true;
            }).AddEntityFrameworkStores<AuthDbContext>().AddDefaultTokenProviders();

            return services;
        }
    }
}
