using League.Application.Common.Interfaces;
using League.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace League.Infrastructure.Persistence.Repositories
{
    public class TournamentRepository : ITournamentRepository
    {
        private readonly ApplicationDbContext _context;

        public TournamentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Tournament?> GetByIdAsync(Guid id)
        {
            return await _context.Tournaments.FindAsync(id);
        }

        public async Task<List<Tournament>> GetAllAsync()
        {
            // Ordenamos por fecha de inicio descendente (el más nuevo primero)
            return await _context.Tournaments
                .AsNoTracking()
                .OrderByDescending(t => t.StartDate)
                .ToListAsync();
        }

        public async Task AddAsync(Tournament tournament)
        {
            await _context.Tournaments.AddAsync(tournament);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Tournament tournament)
        {
            _context.Tournaments.Update(tournament);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var t = await _context.Tournaments.FindAsync(id);
            if (t != null)
            {
                _context.Tournaments.Remove(t);
                await _context.SaveChangesAsync();
            }
        }
    }
}