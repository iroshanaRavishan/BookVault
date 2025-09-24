using BookVault.Data;
using BookVault.Domain.Entities;
using BookVault.Domain.Interfaces;
using BookVault.Infrastructure.Data;
using BookVault.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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

            services.AddDbContext<BookmarkDbContext>(options =>
                options.UseNpgsql(connectionString, u => u.MigrationsAssembly(typeof(BookmarkDbContext).Assembly.FullName)));

            services.AddDbContext<NoteDbContext>(options =>
               options.UseNpgsql(connectionString, u => u.MigrationsAssembly(typeof(NoteDbContext).Assembly.FullName)));

            // Configure authentication
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddCookie(options =>
            {
                options.Cookie.HttpOnly = true;
                options.Cookie.SameSite = SameSiteMode.None; // Allow cross-site requests
                options.Cookie.SecurePolicy = Microsoft.AspNetCore.Http.CookieSecurePolicy.Always;
                options.Cookie.Name = "BookVaultCookies";
                options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
            })
            .AddJwtBearer(options =>
            {
                 // Defines the parameters used to validate the incoming JWT token
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true, // Ensures the token was issued by a trusted issuer
                    ValidateAudience = true, // Ensures the token was intended for this application
                    ValidateLifetime = true, // Ensures the token has not expired
                    ValidateIssuerSigningKey = true, // Ensures the token was signed with a valid key

                    ValidIssuer = configuration["AuthSettings:Issuer"],
                    ValidAudience = configuration["AuthSettings:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(configuration["AuthSettings:SecretKey"])
                    )
                };
            });

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
            })
                .AddEntityFrameworkStores<AuthDbContext>()
                .AddDefaultTokenProviders();

            // Register repositories
            services.AddScoped<IBookRepository, BookRepository>();
            services.AddScoped<IDefaultUserProfilePictureRepository, DefaultUserProfilePictureRepository>();
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IPdfThumbnailRepository, PdfThumbnailRepository>();
            services.AddScoped<IBookmarkRepository, BookmarkRepository>();
            services.AddScoped<INoteRepository, NoteRepository>();
            services.AddScoped<IAppearanceRepository, AppearanceRepository>();

            return services;
        }
    }
}
