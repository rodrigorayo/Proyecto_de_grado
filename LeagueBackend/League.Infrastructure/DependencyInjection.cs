using League.Application.Common.Interfaces;
using League.Infrastructure.Identity; // Asegúrate de que esta carpeta y clase existan
using League.Infrastructure.Persistence.Repositories;
using League.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;

namespace League.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            // Seguridad
            services.AddScoped<IPasswordHasher, PasswordHasher>();
            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
            // Identidad
            services.AddScoped<IUserService, UserService>();

            services.AddScoped<IImageService, CloudinaryImageService>();
            services.AddScoped<IAIService, GeminiAIService>();

            services.AddScoped<ITeamRepository, TeamRepository>();
            services.AddScoped<IPlayerRepository, PlayerRepository>();
            services.AddScoped<ITournamentRepository, TournamentRepository>();
            services.AddScoped<IMatchRepository, MatchRepository>();
            services.AddScoped<IMatchEventRepository, MatchEventRepository>();

            return services;
        }
    }
}