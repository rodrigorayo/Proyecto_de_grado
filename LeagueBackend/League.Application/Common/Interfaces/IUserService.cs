using System.Threading.Tasks;
using League.Domain.Enums;

namespace League.Application.Common.Interfaces
{
    public interface IUserService
    {
        Task<string> RegisterUserAsync(string userName, string email, string password, UserRole role, string nombreCompleto = null);
        Task<string> LoginAsync(string userName, string password);
        Task<(string userName, string email, string nombreCompleto, string[] roles)> GetCurrentUserAsync(string userId);
    }
}
