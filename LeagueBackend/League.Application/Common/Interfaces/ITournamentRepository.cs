using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using League.Domain.Entities;

namespace League.Application.Common.Interfaces
{
    public interface ITournamentRepository
    {
        Task<Tournament> GetByIdAsync(Guid id);
        Task<List<Tournament>> GetAllAsync();
        Task AddAsync(Tournament tournament);
        Task UpdateAsync(Tournament tournament);
        Task DeleteAsync(Guid id);
    }
}
