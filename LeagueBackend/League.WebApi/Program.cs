using League.Presentation;
using League.Application;
using League.Infrastructure;
using League.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar Serilog
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// 2. Agregar capas
builder.Services.AddApplication();
builder.Services.AddInfrastructure();
builder.Services.AddPresentation();

// 3. Base de Datos
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString,
        b => b.MigrationsAssembly("League.Infrastructure")));

// --- NUEVO: CONFIGURAR CORS ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:3000", "http://localhost:4200") // Puerto de Angular
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});
// ------------------------------

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSerilogRequestLogging();
app.UseHttpsRedirection();

// --- NUEVO: USAR CORS (Importante: Antes de Auth) ---
app.UseCors("AllowAngular");
// ----------------------------------------------------

app.UseAuthorization();
app.MapControllers();

app.Run();