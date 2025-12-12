using League.Application.Common.Interfaces;
using League.Domain.Entities;
using League.Domain.Enums;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.Players.Commands.CreatePlayer
{
    public record CreatePlayerCommand(
        string FullName,
        string CI, // <--- CAMPO OBLIGATORIO
        int Number,
        string Position,
        Guid TeamId,
        DateTime? BirthDate
    ) : IRequest<Guid>;

    public class CreatePlayerCommandHandler : IRequestHandler<CreatePlayerCommand, Guid>
    {
        private readonly IPlayerRepository _playerRepository;
        private readonly ITeamRepository _teamRepository;

        public CreatePlayerCommandHandler(IPlayerRepository playerRepository, ITeamRepository teamRepository)
        {
            _playerRepository = playerRepository;
            _teamRepository = teamRepository;
        }

        public async Task<Guid> Handle(CreatePlayerCommand request, CancellationToken cancellationToken)
        {
            // 1. Validar que el equipo exista
            var team = await _teamRepository.GetByIdAsync(request.TeamId);
            if (team == null) throw new Exception("El equipo seleccionado no existe.");

            // 2. VALIDAR QUE EL CI NO EXISTA (UNICIDAD)
            var existingPlayer = await _playerRepository.GetByCiAsync(request.CI);
            if (existingPlayer != null)
            {
                throw new Exception($"Ya existe un jugador registrado con el CI {request.CI}.");
            }

            // 3. Convertir Posición
            if (!Enum.TryParse<PlayerPosition>(request.Position, true, out var positionEnum))
            {
                positionEnum = PlayerPosition.Midfielder;
            }

            // 4. Crear Entidad
            var player = new Player(
                request.FullName,
                request.CI, // Pasamos el CI
                positionEnum,
                request.Number,
                request.TeamId,
                request.BirthDate
            );

            await _playerRepository.AddAsync(player);
            return player.Id;
        }
    }
}