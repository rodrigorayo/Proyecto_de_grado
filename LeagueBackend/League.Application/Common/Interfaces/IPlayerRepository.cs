using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using League.Domain.Entities;

namespace League.Application.Common.Interfaces
{
    public interface IPlayerRepository
    {
        Task<Player> GetByIdAsync(Guid id);
        Task<List<Player>> GetByTeamAsync(Guid teamId);
        Task AddAsync(Player player);
        Task UpdateAsync(Player player);
        Task DeleteAsync(Guid id);
    }
}
