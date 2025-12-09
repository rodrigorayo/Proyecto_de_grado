using League.Application.Common.Interfaces;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.Users.Queries
{
    public record LoginQuery(string UserName, string Password) : IRequest<string>;

    public class LoginQueryHandler : IRequestHandler<LoginQuery, string>
    {
        private readonly IUserService _userService;

        public LoginQueryHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<string> Handle(LoginQuery request, CancellationToken cancellationToken)
        {
            return await _userService.LoginAsync(request.UserName, request.Password);
        }
    }
}
