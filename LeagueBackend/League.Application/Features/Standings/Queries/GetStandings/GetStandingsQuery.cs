using League.Application.Common.Interfaces;
using League.Application.DTOs;
using League.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.Standings.Queries.GetStandings
{
    // 1. La Petición (Query)
    public record GetStandingsQuery(Guid TournamentId) : IRequest<List<TeamStandingDto>>;

    // 2. El Manejador (Handler) - AQUÍ ESTÁ LA LÓGICA INTELIGENTE
    public class GetStandingsQueryHandler : IRequestHandler<GetStandingsQuery, List<TeamStandingDto>>
    {
        private readonly IMatchRepository _matchRepository;

        public GetStandingsQueryHandler(IMatchRepository matchRepository)
        {
            _matchRepository = matchRepository;
        }

        public async Task<List<TeamStandingDto>> Handle(GetStandingsQuery request, CancellationToken cancellationToken)
        {
            // A. Obtener TODOS los partidos del torneo
            // El repositorio ya trae los datos de HomeTeam y AwayTeam gracias a los .Include()
            var matches = await _matchRepository.GetByTournamentIdAsync(request.TournamentId);

            // B. LÓGICA NUEVA: Encontrar equipos mirando el Fixture
            // En lugar de buscar en la tabla Teams, miramos quiénes juegan en este torneo.
            var teams = matches.Select(m => m.HomeTeam)
                        .Union(matches.Select(m => m.AwayTeam))
                        .Where(t => t != null) // Filtramos nulos por seguridad
                        .DistinctBy(t => t!.Id) // Eliminamos duplicados
                        .ToList();

            // C. Inicializar la tabla de posiciones con los equipos encontrados
            var standings = teams.Select(t => new TeamStandingDto
            {
                TeamId = t!.Id,
                TeamName = t.Name
            }).ToDictionary(s => s.TeamId);

            // D. Filtrar solo los partidos JUGADOS (Finalized = 2)
            var finishedMatches = matches.Where(m => m.Status == MatchStatus.Finalized).ToList();

            // E. Calcular puntos
            foreach (var match in finishedMatches)
            {
                if (!standings.ContainsKey(match.HomeTeamId) || !standings.ContainsKey(match.AwayTeamId)) continue;

                var home = standings[match.HomeTeamId];
                var away = standings[match.AwayTeamId];

                // Partidos Jugados
                home.Played++;
                away.Played++;

                // Goles
                int hScore = match.HomeScore ?? 0;
                int aScore = match.AwayScore ?? 0;

                home.GoalsFor += hScore;
                home.GoalsAgainst += aScore;
                away.GoalsFor += aScore;
                away.GoalsAgainst += hScore;

                // Puntos
                if (hScore > aScore)
                {
                    home.Won++;
                    home.Points += 3;
                    away.Lost++;
                }
                else if (aScore > hScore)
                {
                    away.Won++;
                    away.Points += 3;
                    home.Lost++;
                }
                else
                {
                    home.Drawn++;
                    home.Points += 1;
                    away.Drawn++;
                    away.Points += 1;
                }
            }

            // F. Ordenar y devolver
            return standings.Values
                .OrderByDescending(x => x.Points)
                .ThenByDescending(x => x.GoalDifference)
                .ThenByDescending(x => x.GoalsFor)
                .ToList();
        }
    }
}