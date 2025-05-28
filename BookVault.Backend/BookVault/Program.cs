using BookVault.Application.Services;
using BookVault.Data;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using BookVault.Application;
using BookVault.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer(); // Add this for better API documentation
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddTransient<IBookService, BookService>();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Configure JSON serialization for better API documentation
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

builder.Services.AddDbContext<BookDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseNpgsql(connectionString);
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
    var dbContext = serviceScope.ServiceProvider.GetRequiredService<BookDbContext>();
    var logger = serviceScope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        logger.LogInformation("Applying database migrations...");
        await dbContext.Database.MigrateAsync();
        logger.LogInformation("Database migrations applied successfully");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while applying migrations");
        // Don't throw here to allow app to start
    }
}

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

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
