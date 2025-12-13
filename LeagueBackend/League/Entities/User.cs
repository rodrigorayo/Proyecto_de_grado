using System;
using System.Collections.Generic;

namespace League.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }

        // Corrección 1: Aseguramos que sea UserName (PascalCase)
        public string UserName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;

        // Corrección 2: Cambiamos byte[] por string para usar BCrypt
        public string PasswordHash { get; set; } = string.Empty;

        // Relación con Roles
        public Guid RoleId { get; set; }
        public Role? Role { get; set; }
    }
}