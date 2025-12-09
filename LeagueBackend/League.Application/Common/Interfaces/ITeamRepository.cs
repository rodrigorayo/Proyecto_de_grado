using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using League.Domain.Entities;

namespace League.Application.Common.Interfaces
{
    public interface ITeamRepository
    {
        Task<Team> GetByIdAsync(Guid id);
        Task<List<Team>> GetAllAsync();
        Task AddAsync(Team team);
        Task UpdateAsync(Team team);
        Task DeleteAsync(Guid id);
    }
}
