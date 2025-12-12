using League.Domain.Entities;
using MediatR;
using System.Collections.Generic;

namespace League.Application.Features.Teams.Queries.GetTeams
{
    // Esto es una solicitud: "Quiero una Lista de Equipos"
    // Al ser un 'record', se ve "vacío", pero es una clase completa en una sola línea.
    public record GetTeamsQuery : IRequest<List<Team>>;
}