using League.Application.Common.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.Teams.Commands.UpdateTeam
{
    public record UpdateTeamCommand(Guid Id, string Name, string Category, string? LogoUrl) : IRequest;

    public class UpdateTeamCommandHandler : IRequestHandler<UpdateTeamCommand>
    {
        private readonly ITeamRepository _repository;

        public UpdateTeamCommandHandler(ITeamRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(UpdateTeamCommand request, CancellationToken cancellationToken)
        {
            var team = await _repository.GetByIdAsync(request.Id);

            if (team == null)
                throw new Exception("Equipo no encontrado.");

            // Usamos el método de negocio de la entidad
            team.UpdateInfo(request.Name, request.Category, null, request.LogoUrl);

            await _repository.UpdateAsync(team);
        }
    }
}