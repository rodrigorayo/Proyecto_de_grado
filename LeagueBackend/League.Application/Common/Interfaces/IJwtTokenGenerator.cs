using League.Domain.Entities; // Para acceder a la clase User
using System;

namespace League.Application.Common.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user, string roleName);
    }
}