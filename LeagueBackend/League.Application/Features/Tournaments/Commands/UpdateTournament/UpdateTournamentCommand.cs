using League.Application.Common.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.Tournaments.Commands.UpdateTournament
{
    public record UpdateTournamentCommand(Guid Id, string Name, DateTime StartDate, DateTime? EndDate) : IRequest;

    public class UpdateTournamentCommandHandler : IRequestHandler<UpdateTournamentCommand>
    {
        private readonly ITournamentRepository _repository;

        public UpdateTournamentCommandHandler(ITournamentRepository repository) => _repository = repository;

        public async Task Handle(UpdateTournamentCommand request, CancellationToken cancellationToken)
        {
            var tournament = await _repository.GetByIdAsync(request.Id);
            if (tournament == null) throw new Exception("Torneo no encontrado");

            tournament.UpdateDetails(request.Name, request.StartDate, request.EndDate);
            await _repository.UpdateAsync(tournament);
        }
    }
}