using League.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace League.Application.Common.Interfaces
{
    public interface ITeamRepository
    {
        // El ? indica que puede retornar null si no existe el ID
        Task<Team?> GetByIdAsync(Guid id);

        Task<List<Team>> GetAllAsync();
        Task AddAsync(Team team);
        Task UpdateAsync(Team team);
        Task DeleteAsync(Guid id);
    }
}