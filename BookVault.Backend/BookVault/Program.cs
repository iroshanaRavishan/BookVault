using BookVault.Application;
using BookVault.Application.Interfaces;
using BookVault.Data;
using BookVault.Infrastructure;
using BookVault.Infrastructure.Data;
using BookVault.Infrastructure.Services.BookVault.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using BookVault.Shared;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer(); // Add this for better API documentation

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Add SignalR
builder.Services.AddSignalR();

// Add INotificationService
builder.Services.AddScoped<INotificationService, SignalRNotificationService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Configure JSON serialization for better API documentation
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.Title = "BookVault API";
        options.Theme = ScalarTheme.BluePlanet;
    });
}

// Apply migrations
await using (var serviceScope = app.Services.CreateAsyncScope())
{
    var defaultPicContext = serviceScope.ServiceProvider.GetRequiredService<DefaultUserProfilePictureDbContext>();
    var bookContext = serviceScope.ServiceProvider.GetRequiredService<BookDbContext>();
    var authContext = serviceScope.ServiceProvider.GetRequiredService<AuthDbContext>();
    var bookmarkContext = serviceScope.ServiceProvider.GetRequiredService<BookmarkDbContext>();
    var noteContext = serviceScope.ServiceProvider.GetRequiredService<NoteDbContext>();
    var appearanceContext = serviceScope.ServiceProvider.GetRequiredService<AppearanceDbContext>();
    var logger = serviceScope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        logger.LogInformation("Applying DefaultUserProfilePictureDbContext migrations...");
        await defaultPicContext.Database.MigrateAsync();
        logger.LogInformation("DefaultUserProfilePictureDbContext migrations applied successfully");

        logger.LogInformation("Applying BookDbContext migrations...");
        await bookContext.Database.MigrateAsync();
        logger.LogInformation("BookDbContext migrations applied successfully");

        logger.LogInformation("Applying Auth migrations...");
        await authContext.Database.MigrateAsync();
        logger.LogInformation("AuthDbContext migrations applied successfully");

        logger.LogInformation("Applying Bookmark migrations...");
        await bookmarkContext.Database.MigrateAsync();
        logger.LogInformation("BookmarkDbContext migrations applied successfully");

        logger.LogInformation("Applying Note migrations...");
        await noteContext.Database.MigrateAsync();
        logger.LogInformation("noteDbContext migrations applied successfully");

        logger.LogInformation("Applying Appearance migrations...");
        await appearanceContext.Database.MigrateAsync();
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while applying migrations");
        // not throwing here to allow app to start
    }
}

app.UseHttpsRedirection();

// Configure CORS
app.UseCors(policy => policy
    .WithOrigins("https://localhost:5173", "http://localhost:5173")
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials());

// Add static files middleware to serve uploaded files
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "uploads")),
    RequestPath = "/uploads"
});

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

// Map SignalR hubs
app.MapHub<NotificationHub>("/hubs/notifications");

app.Run();
