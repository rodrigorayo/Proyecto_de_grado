using League.Application.Common.Interfaces;
using League.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.Matches.Queries.GetMatchesByTournament
{
    public record GetMatchesByTournamentQuery(Guid TournamentId) : IRequest<List<Match>>;

    public class GetMatchesByTournamentQueryHandler : IRequestHandler<GetMatchesByTournamentQuery, List<Match>>
    {
        private readonly IMatchRepository _repository;

        public GetMatchesByTournamentQueryHandler(IMatchRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Match>> Handle(GetMatchesByTournamentQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetByTournamentIdAsync(request.TournamentId);
        }
    }
}