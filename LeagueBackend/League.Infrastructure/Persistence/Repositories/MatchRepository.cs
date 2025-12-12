using League.Application.Common.Interfaces;
using League.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace League.Infrastructure.Persistence.Repositories
{
    public class MatchRepository : IMatchRepository
    {
        private readonly ApplicationDbContext _context;

        public MatchRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Match?> GetByIdAsync(Guid id)
        {
            return await _context.Matches
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<List<Match>> GetByTournamentIdAsync(Guid tournamentId)
        {
            // Traemos los partidos con los datos de los equipos para mostrar nombres
            return await _context.Matches
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .Where(m => m.TournamentId == tournamentId)
                .OrderBy(m => m.MatchDate) // Ordenados por fecha
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task AddAsync(Match match)
        {
            await _context.Matches.AddAsync(match);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Match match)
        {
            _context.Matches.Update(match);
            await _context.SaveChangesAsync();
        }
    }
}