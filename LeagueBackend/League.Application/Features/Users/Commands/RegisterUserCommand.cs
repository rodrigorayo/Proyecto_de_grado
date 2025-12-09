using League.Application.Common.Interfaces;
using League.Domain.Enums;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.Users.Commands
{
    public record RegisterUserCommand(string UserName, string Email, string Password, UserRole Role, string NombreCompleto) : IRequest<string>;

    public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, string>
    {
        private readonly IUserService _userService;

        public RegisterUserCommandHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<string> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            return await _userService.RegisterUserAsync(request.UserName, request.Email, request.Password, request.Role, request.NombreCompleto);
        }
    }
}
