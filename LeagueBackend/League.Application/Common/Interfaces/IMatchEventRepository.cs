using League.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace League.Application.Common.Interfaces
{
    public interface IMatchEventRepository
    {
        Task AddAsync(MatchEvent matchEvent);
        Task<List<MatchEvent>> GetByMatchIdAsync(Guid matchId);
        // Para la tabla de goleadores (Top Scorers)
        Task<List<MatchEvent>> GetAllGoalsAsync();
    }
}