using League.Application.Common.Interfaces;
using League.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.Matches.Commands.CreateMatch
{
    // Datos necesarios para programar un partido
    public record CreateMatchCommand(
        Guid TournamentId,
        Guid HomeTeamId,
        Guid AwayTeamId,
        DateTime MatchDate,
        string Venue
    ) : IRequest<Guid>;

    public class CreateMatchCommandHandler : IRequestHandler<CreateMatchCommand, Guid>
    {
        private readonly IMatchRepository _repository;

        public CreateMatchCommandHandler(IMatchRepository repository)
        {
            _repository = repository;
        }

        public async Task<Guid> Handle(CreateMatchCommand request, CancellationToken cancellationToken)
        {
            // Creamos la entidad (El constructor de Match ya valida que los equipos sean distintos)
            var match = new Match(
                request.TournamentId,
                request.HomeTeamId,
                request.AwayTeamId,
                request.MatchDate,
                request.Venue
            );

            await _repository.AddAsync(match);
            return match.Id;
        }
    }
}