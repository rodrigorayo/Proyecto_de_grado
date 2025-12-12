using League.Application.Common.Interfaces;
using League.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.Teams.Commands.CreateTeam
{
    public class CreateTeamCommandHandler : IRequestHandler<CreateTeamCommand, Guid>
    {
        private readonly ITeamRepository _repository;

        public CreateTeamCommandHandler(ITeamRepository repository)
        {
            _repository = repository;
        }

        public async Task<Guid> Handle(CreateTeamCommand request, CancellationToken cancellationToken)
        {
            // 1. Convertimos el Command (DTO) a la Entidad de Dominio
            var team = new Team(request.Name, request.Category, null, request.LogoUrl);

            // 2. Guardamos en BD usando el repositorio
            await _repository.AddAsync(team);

            // 3. Devolvemos el ID generado
            return team.Id;
        }
    }
}