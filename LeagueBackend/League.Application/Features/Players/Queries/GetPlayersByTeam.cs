using League.Application.Common.Interfaces;
using League.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.Players.Queries.GetPlayersByTeam
{
    public record GetPlayersByTeamQuery(Guid TeamId) : IRequest<List<Player>>;

    public class GetPlayersByTeamQueryHandler : IRequestHandler<GetPlayersByTeamQuery, List<Player>>
    {
        private readonly IPlayerRepository _repository;

        public GetPlayersByTeamQueryHandler(IPlayerRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Player>> Handle(GetPlayersByTeamQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetByTeamIdAsync(request.TeamId);
        }
    }
}