using League.Application.Common.Interfaces;
using League.Domain.Entities;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.Tournaments.Queries.GetTournaments
{
    public record GetTournamentsQuery : IRequest<List<Tournament>>;

    public class GetTournamentsQueryHandler : IRequestHandler<GetTournamentsQuery, List<Tournament>>
    {
        private readonly ITournamentRepository _repository;

        public GetTournamentsQueryHandler(ITournamentRepository repository) => _repository = repository;

        public async Task<List<Tournament>> Handle(GetTournamentsQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetAllAsync();
        }
    }
}