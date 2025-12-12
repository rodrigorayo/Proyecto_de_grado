using League.Application.Common.Interfaces;
using League.Domain.Entities;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.Teams.Queries.GetTeams
{
    // Este es el "Cartero" que recibe la solicitud y va a la base de datos
    public class GetTeamsQueryHandler : IRequestHandler<GetTeamsQuery, List<Team>>
    {
        private readonly ITeamRepository _repository;

        public GetTeamsQueryHandler(ITeamRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Team>> Handle(GetTeamsQuery request, CancellationToken cancellationToken)
        {
            // Llama al repositorio para traer todos los equipos
            return await _repository.GetAllAsync();
        }
    }
}