using FilmVault.Data;
using FilmVault.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddCors();
builder.Services.AddOpenApi();
builder.Services.AddTransient<IFilmService, FilmService>();
builder.Services.AddControllers();

builder.Services.AddDbContext<FilmDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseNpgsql(connectionString);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// triggering the seeding process
// remove this when deploying to production
await using (var serviceScope = app.Services.CreateAsyncScope())
await using (var dbContext = serviceScope.ServiceProvider.GetRequiredService<FilmDbContext>())
{
    await dbContext.Database.EnsureCreatedAsync();
}

app.UseCors(policy => policy
    .WithOrigins("https://localhost:5173", "http://localhost:5173")  // Replace with app URL
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials());

app.UseHttpsRedirection();

app.MapControllers();

app.Run();