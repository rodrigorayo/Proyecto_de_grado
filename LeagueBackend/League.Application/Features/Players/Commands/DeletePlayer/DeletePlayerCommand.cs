using League.Application.Common.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace League.Application.Features.Players.Commands.DeletePlayer
{
    public record DeletePlayerCommand(Guid Id) : IRequest;

    public class DeletePlayerCommandHandler : IRequestHandler<DeletePlayerCommand>
    {
        private readonly IPlayerRepository _repository;

        public DeletePlayerCommandHandler(IPlayerRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(DeletePlayerCommand request, CancellationToken cancellationToken)
        {
            await _repository.DeleteAsync(request.Id);
        }
    }
}