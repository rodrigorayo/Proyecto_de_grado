using League.Application.Common.Interfaces;
using League.Domain.Entities;
using League.Domain.Enums;
using League.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
// Agregamos BCrypt
using BCrypt.Net;

namespace League.Infrastructure.Identity
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        // Eliminamos IPasswordHasher, ya no se usa
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public UserService(
            ApplicationDbContext context,
            IJwtTokenGenerator jwtTokenGenerator)
        {
            _context = context;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<string> RegisterUserAsync(string userName, string email, string password, UserRole role, string nombreCompleto)
        {
            // 1. Validar duplicados
            if (await _context.Users.AnyAsync(u => u.Email == email))
            {
                throw new Exception("El correo electrónico ya está registrado.");
            }

            // 2. Buscar Rol
            var roleName = role.ToString();
            // Nota: En la iteración 5 preferimos usar RoleId directo, pero mantenemos esta lógica
            // por compatibilidad con tu código actual.
            var dbRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == roleName);

            // Fallback: Si el rol es "Referee" (antiguo) buscamos "Committee"
            if (dbRole == null && roleName == "Referee")
            {
                dbRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Committee");
            }

            if (dbRole == null)
            {
                // Si aún falla, asignamos Fan o Admin por defecto para no romper el flujo
                // O lanzamos error. Por ahora, lanzamos error.
                throw new Exception($"El rol '{roleName}' no existe. Roles disponibles: Admin, Delegate, Committee.");
            }

            // 3. Hash Password (MODO NUEVO: BCrypt)
            // Genera un string, no bytes. No requiere salt manual.
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

            // 4. Guardar Usuario
            var user = new User
            {
                Id = Guid.NewGuid(),
                FullName = nombreCompleto,
                UserName = userName, // Asegúrate que coincida con tu entidad (UserName vs Username)
                Email = email,
                PasswordHash = passwordHash, // Asignamos el string
                RoleId = dbRole.Id
                // Quitamos IsActive y PasswordSalt porque no existen en la entidad nueva
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user.Id.ToString();
        }

        public async Task<string> LoginAsync(string userName, string password)
        {
            // 1. Buscar usuario
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == userName || u.UserName == userName);

            if (user == null)
            {
                throw new Exception("Credenciales inválidas.");
            }

            // 2. Verificar Contraseña (MODO NUEVO: BCrypt)
            // Compara el texto plano con el hash guardado
            bool isValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);

            if (!isValid)
            {
                throw new Exception("Credenciales inválidas.");
            }

            // 3. Generar Token
            var roleName = user.Role?.Name ?? "Fan";
            var token = _jwtTokenGenerator.GenerateToken(user, roleName);

            return token;
        }

        public Task<(string userName, string email, string nombreCompleto, string[] roles)> GetCurrentUserAsync(string userId)
        {
            return Task.FromResult(("Usuario", "test@test.com", "Nombre Test", new[] { "Admin" }));
        }
    }
}