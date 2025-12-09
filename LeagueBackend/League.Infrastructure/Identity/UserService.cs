using League.Application.Common.Interfaces;
using League.Domain.Entities;
using League.Domain.Enums;
using League.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace League.Infrastructure.Identity
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public UserService(
            ApplicationDbContext context,
            IPasswordHasher passwordHasher,
            IJwtTokenGenerator jwtTokenGenerator)
        {
            _context = context;
            _passwordHasher = passwordHasher;
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
            var dbRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == roleName);

            if (dbRole == null)
            {
                throw new Exception($"El rol '{roleName}' no existe en la base de datos.");
            }

            // 3. Hash Password
            _passwordHasher.CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);

            // 4. Guardar Usuario
            var user = new User
            {
                Id = Guid.NewGuid(),
                FullName = nombreCompleto,
                Email = email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                RoleId = dbRole.Id,
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user.Id.ToString();
        }

        public async Task<string> LoginAsync(string userName, string password)
        {
            // 1. Buscar usuario por Email (userName lo tratamos como email)
            var user = await _context.Users
                .Include(u => u.Role) // Importante: Traer el rol para el token
                .FirstOrDefaultAsync(u => u.Email == userName);

            if (user == null)
            {
                throw new Exception("Credenciales inválidas.");
            }

            // 2. Verificar Contraseña
            if (!_passwordHasher.VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                throw new Exception("Credenciales inválidas.");
            }

            // 3. Generar Token Real
            // Asumimos que user.Role nunca es nulo por la integridad referencial, 
            // pero usamos ? para seguridad.
            var roleName = user.Role?.Name ?? "Fan";
            var token = _jwtTokenGenerator.GenerateToken(user, roleName);

            return token;
        }

        public Task<(string userName, string email, string nombreCompleto, string[] roles)> GetCurrentUserAsync(string userId)
        {
            // Este lo dejamos pendiente para cuando necesites ver el perfil
            return Task.FromResult(("Usuario", "test@test.com", "Nombre Test", new[] { "Admin" }));
        }
    }
}