using League.Application.Common.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.Matches.Commands.RegisterMatchResult
{
    // Datos necesarios: ID del partido y los goles
    public record RegisterMatchResultCommand(Guid MatchId, int HomeScore, int AwayScore) : IRequest;

    public class RegisterMatchResultCommandHandler : IRequestHandler<RegisterMatchResultCommand>
    {
        private readonly IMatchRepository _repository;

        public RegisterMatchResultCommandHandler(IMatchRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(RegisterMatchResultCommand request, CancellationToken cancellationToken)
        {
            var match = await _repository.GetByIdAsync(request.MatchId);
            if (match == null) throw new Exception("Partido no encontrado.");

            // Usamos el método de negocio que creamos en la entidad Match
            match.FinishMatch(request.HomeScore, request.AwayScore);

            await _repository.UpdateAsync(match);
        }
    }
}