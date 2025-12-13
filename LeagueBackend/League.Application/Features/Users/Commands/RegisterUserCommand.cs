using League.Application.Common.Interfaces;
using League.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using BCrypt.Net;

namespace League.Application.Features.Users.Commands
{
    public record RegisterUserCommand(
        string UserName,
        string Email,
        string Password,
        string FullName,
        Guid RoleId
    ) : IRequest<Guid>;

    public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, Guid>
    {
        private readonly IApplicationDbContext _context;

        public RegisterUserCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            var user = new User
            {
                Id = Guid.NewGuid(),
                // Corrección 1: Coincide con la entidad (UserName)
                UserName = request.UserName,
                Email = request.Email,
                FullName = request.FullName,
                RoleId = request.RoleId,
                // Corrección 2: BCrypt devuelve string y ahora la entidad lo acepta
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync(cancellationToken);

            return user.Id;
        }
    }
}