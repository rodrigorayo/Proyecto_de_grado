using League.Application.Common.Interfaces;
using League.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.MatchEvents.Queries.GetMatchEvents
{
    public record GetMatchEventsQuery(Guid MatchId) : IRequest<List<MatchEvent>>;

    public class GetMatchEventsQueryHandler : IRequestHandler<GetMatchEventsQuery, List<MatchEvent>>
    {
        private readonly IMatchEventRepository _repository;

        public GetMatchEventsQueryHandler(IMatchEventRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<MatchEvent>> Handle(GetMatchEventsQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetByMatchIdAsync(request.MatchId);
        }
    }
}