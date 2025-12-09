using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using League.Domain.Entities;

namespace League.Application.Common.Interfaces
{
    public interface IMatchRepository
    {
        Task<Match> GetByIdAsync(Guid id);
        Task<List<Match>> GetAllAsync();
        Task AddAsync(Match match);
        Task UpdateAsync(Match match);
        Task DeleteAsync(Guid id);
    }
}
