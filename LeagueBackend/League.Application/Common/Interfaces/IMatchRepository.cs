using League.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace League.Application.Common.Interfaces
{
    public interface IMatchRepository
    {
        Task<Match?> GetByIdAsync(Guid id);

        // Traer todos los partidos de un torneo (El Fixture)
        Task<List<Match>> GetByTournamentIdAsync(Guid tournamentId);

        Task AddAsync(Match match);
        Task UpdateAsync(Match match);
    }
}