using League.Application.Common.Interfaces;
using League.Domain.Enums;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.Players.Commands.UpdatePlayer
{
    public record UpdatePlayerCommand(
        Guid Id,
        string FullName,
        string CI,
        int Number,
        string Position,
        DateTime? BirthDate,
        string? PhotoUrl // 👈 Agregado
    ) : IRequest;

    public class UpdatePlayerCommandHandler : IRequestHandler<UpdatePlayerCommand>
    {
        private readonly IPlayerRepository _repository;

        public UpdatePlayerCommandHandler(IPlayerRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(UpdatePlayerCommand request, CancellationToken cancellationToken)
        {
            var player = await _repository.GetByIdAsync(request.Id);
            if (player == null) throw new Exception("Jugador no encontrado.");

            // Validar Unicidad CI al editar
            var playerWithSameCi = await _repository.GetByCiAsync(request.CI);
            if (playerWithSameCi != null && playerWithSameCi.Id != request.Id)
            {
                throw new Exception($"El CI {request.CI} ya pertenece a otro jugador.");
            }

            if (!Enum.TryParse<PlayerPosition>(request.Position, true, out var positionEnum))
            {
                positionEnum = PlayerPosition.Midfielder;
            }

            // Actualizamos con la foto
            player.UpdateDetails(request.FullName, request.CI, request.Number, positionEnum, request.BirthDate, request.PhotoUrl);

            await _repository.UpdateAsync(player);
        }
    }
}