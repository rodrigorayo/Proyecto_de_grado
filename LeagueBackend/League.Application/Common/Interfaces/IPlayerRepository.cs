using League.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace League.Application.Common.Interfaces
{
    public interface IPlayerRepository
    {
        Task<Player?> GetByIdAsync(Guid id);
        Task<List<Player>> GetAllAsync();
        Task<List<Player>> GetByTeamIdAsync(Guid teamId);

        // NUEVO: Buscar por Carnet de Identidad
        Task<Player?> GetByCiAsync(string ci);

        Task AddAsync(Player player);
        Task UpdateAsync(Player player);
        Task DeleteAsync(Guid id);
    }
}