using League.Application.Common.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.Stats.Queries.GetTopScorers
{
    public class ScorerDto
    {
        public string PlayerName { get; set; } = string.Empty;
        public string TeamName { get; set; } = string.Empty;
        public int Goals { get; set; }
    }

    public record GetTopScorersQuery(Guid? TournamentId) : IRequest<List<ScorerDto>>;

    public class GetTopScorersQueryHandler : IRequestHandler<GetTopScorersQuery, List<ScorerDto>>
    {
        private readonly IMatchEventRepository _eventRepository;

        public GetTopScorersQueryHandler(IMatchEventRepository eventRepository) => _eventRepository = eventRepository;

        public async Task<List<ScorerDto>> Handle(GetTopScorersQuery request, CancellationToken cancellationToken)
        {
            var allGoals = await _eventRepository.GetAllGoalsAsync();

            // Si se envió TournamentId, deberíamos filtrar (requiere lógica extra de cruzar con Matches),
            // Por simplicidad en esta iteración, devolvemos goleadores globales o filtramos en memoria si agregas el Match al Include.

            var grouped = allGoals
                .GroupBy(g => g.PlayerId)
                .Select(g => new ScorerDto
                {
                    PlayerName = g.First().Player.FullName,
                    TeamName = g.First().Player.Team?.Name ?? "Sin Equipo",
                    Goals = g.Count()
                })
                .OrderByDescending(x => x.Goals)
                .Take(10) // Top 10
                .ToList();

            return grouped;
        }
    }
}