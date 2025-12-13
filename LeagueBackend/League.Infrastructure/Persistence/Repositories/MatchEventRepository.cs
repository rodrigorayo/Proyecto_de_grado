using League.Application.Common.Interfaces;
using League.Domain.Entities;
using League.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace League.Infrastructure.Persistence.Repositories
{
    public class MatchEventRepository : IMatchEventRepository
    {
        private readonly ApplicationDbContext _context;

        public MatchEventRepository(ApplicationDbContext context) => _context = context;

        public async Task AddAsync(MatchEvent matchEvent)
        {
            await _context.MatchEvents.AddAsync(matchEvent);
            await _context.SaveChangesAsync();
        }

        public async Task<List<MatchEvent>> GetByMatchIdAsync(Guid matchId)
        {
            return await _context.MatchEvents
                .Include(e => e.Player) // Incluir nombre del jugador
                .Where(e => e.MatchId == matchId)
                .OrderBy(e => e.Minute)
                .ToListAsync();
        }

        public async Task<List<MatchEvent>> GetAllGoalsAsync()
        {
            // Trae solo los eventos que son Goles (Type == 0)
            return await _context.MatchEvents
                .Include(e => e.Player)
                .ThenInclude(p => p.Team) // Necesitamos el equipo del jugador
                .Where(e => e.Type == MatchEventType.Goal)
                .ToListAsync();
        }
    }
}