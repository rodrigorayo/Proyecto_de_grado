using League.Application.Common.Interfaces;
using League.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace League.Infrastructure.Persistence.Repositories
{
    public class PlayerRepository : IPlayerRepository
    {
        private readonly ApplicationDbContext _context;

        public PlayerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Player?> GetByIdAsync(Guid id)
        {
            return await _context.Players
                .Include(p => p.Team)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<List<Player>> GetAllAsync()
        {
            return await _context.Players.Include(p => p.Team).AsNoTracking().ToListAsync();
        }

        public async Task<List<Player>> GetByTeamIdAsync(Guid teamId)
        {
            return await _context.Players
                .Where(p => p.TeamId == teamId)
                .AsNoTracking()
                .ToListAsync();
        }

        // IMPLEMENTACIÓN DE BÚSQUEDA POR CI
        public async Task<Player?> GetByCiAsync(string ci)
        {
            return await _context.Players
                .FirstOrDefaultAsync(p => p.CI == ci);
        }

        public async Task AddAsync(Player player)
        {
            await _context.Players.AddAsync(player);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Player player)
        {
            _context.Players.Update(player);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var player = await _context.Players.FindAsync(id);
            if (player != null)
            {
                _context.Players.Remove(player);
                await _context.SaveChangesAsync();
            }
        }
    }
}