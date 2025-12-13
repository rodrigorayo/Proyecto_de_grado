using League.Application.Common.Interfaces;
using League.Domain.Entities;
using League.Domain.Enums;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.MatchEvents.Commands.AddEvent
{
    public record AddMatchEventCommand(Guid MatchId, Guid PlayerId, MatchEventType Type, int Minute) : IRequest<Guid>;

    public class AddMatchEventCommandHandler : IRequestHandler<AddMatchEventCommand, Guid>
    {
        private readonly IMatchEventRepository _repository;

        public AddMatchEventCommandHandler(IMatchEventRepository repository) => _repository = repository;

        public async Task<Guid> Handle(AddMatchEventCommand request, CancellationToken cancellationToken)
        {
            // Aquí podrías validar si el jugador realmente jugó ese partido, pero por ahora confiamos en el Admin.
            var matchEvent = new MatchEvent(
                request.MatchId,
                request.PlayerId,
                request.Type,
                request.Minute
            );

            await _repository.AddAsync(matchEvent);
            return matchEvent.Id;
        }
    }
}