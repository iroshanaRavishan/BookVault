using BookVault.Application.Interfaces;
using BookVault.Application.Services;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            // Register services
            services.AddScoped<IBookService, BookService>();
            services.AddScoped<IDefaultUserProfilePictureService, DefaultUserProfilePictureService>();
            services.AddScoped<IAuthService, AuthService>();

            return services;
        }
    }
}
