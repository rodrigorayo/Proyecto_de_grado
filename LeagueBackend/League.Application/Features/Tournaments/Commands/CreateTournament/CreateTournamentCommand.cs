using League.Application.Common.Interfaces;
using League.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.Tournaments.Commands.CreateTournament
{
    public record CreateTournamentCommand(string Name, DateTime StartDate, DateTime? EndDate) : IRequest<Guid>;

    public class CreateTournamentCommandHandler : IRequestHandler<CreateTournamentCommand, Guid>
    {
        private readonly ITournamentRepository _repository;

        public CreateTournamentCommandHandler(ITournamentRepository repository) => _repository = repository;

        public async Task<Guid> Handle(CreateTournamentCommand request, CancellationToken cancellationToken)
        {
            var tournament = new Tournament(request.Name, request.StartDate);
            if (request.EndDate.HasValue) tournament.Close(request.EndDate.Value);

            await _repository.AddAsync(tournament);
            return tournament.Id;
        }
    }
}