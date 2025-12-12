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
        string CI, // CI obligatorio al editar
        int Number,
        string Position,
        DateTime? BirthDate
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

            // VALIDAR UNICIDAD DEL CI AL EDITAR
            // Buscamos si existe alguien con ese CI
            var playerWithSameCi = await _repository.GetByCiAsync(request.CI);

            // Si existe alguien con ese CI y NO es este mismo jugador (IDs diferentes), es un error
            if (playerWithSameCi != null && playerWithSameCi.Id != request.Id)
            {
                throw new Exception($"El CI {request.CI} ya pertenece a otro jugador.");
            }

            if (!Enum.TryParse<PlayerPosition>(request.Position, true, out var positionEnum))
            {
                positionEnum = PlayerPosition.Midfielder;
            }

            player.UpdateDetails(request.FullName, request.CI, request.Number, positionEnum, request.BirthDate);

            await _repository.UpdateAsync(player);
        }
    }
}