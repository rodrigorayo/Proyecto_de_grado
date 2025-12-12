using MediatR;
using System;

namespace League.Application.Features.Teams.Commands.CreateTeam
{
    // Solo datos, nada de lógica
    public record CreateTeamCommand(string Name, string Category, string? LogoUrl) : IRequest<Guid>;
}