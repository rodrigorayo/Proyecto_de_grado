using League.Application.Common.Interfaces;
using League.Infrastructure.Identity; // Asegúrate de que esta carpeta y clase existan
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

            return services;
        }
    }
}