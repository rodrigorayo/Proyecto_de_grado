using Microsoft.Extensions.DependencyInjection;

namespace League.Presentation;

public static class DependencyInjection
{
    public static IServiceCollection AddPresentation(this IServiceCollection services)
    {
        return services;
    }
}