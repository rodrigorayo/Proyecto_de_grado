using League.Application.Common.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.Teams.Commands.DeleteTeam
{
    // Mantenemos el nombre "Delete" para no romper el Controller,
    // pero internamente hace un "Soft Delete" (Desactivar).
    public record DeleteTeamCommand(Guid Id) : IRequest;

    public class DeleteTeamCommandHandler : IRequestHandler<DeleteTeamCommand>
    {
        private readonly ITeamRepository _repository;

        public DeleteTeamCommandHandler(ITeamRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(DeleteTeamCommand request, CancellationToken cancellationToken)
        {
            // 1. Buscamos el equipo por ID
            var team = await _repository.GetByIdAsync(request.Id);

            // 2. Si existe, cambiamos su estado en lugar de borrarlo
            if (team != null)
            {
                team.ToggleStatus(); // Llama al método de la entidad

                // 3. Guardamos la actualización (Update en vez de Delete)
                await _repository.UpdateAsync(team);
            }
        }
    }
}