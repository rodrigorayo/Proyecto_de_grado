using MediatR;
using League.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using League.Domain.Entities; // Necesario para acceder a Match
// using League.Domain.Enums; // Ya no es estrictamente necesario si usamos el método de la entidad

namespace League.Application.Features.Matches.Commands.UpdateMatchResult
{
    // 1. Datos que vienen del Frontend (DTO)
    public class UpdateMatchResultCommand : IRequest<bool>
    {
        public Guid MatchId { get; set; } // Corregido: Ahora es Guid
        public int HomeScore { get; set; }
        public int AwayScore { get; set; }
        public string? Incidents { get; set; } // Opcional, por si lo usamos luego
    }

    // 2. Lógica de negocio
    public class UpdateMatchResultCommandHandler : IRequestHandler<UpdateMatchResultCommand, bool>
    {
        private readonly IApplicationDbContext _context;

        public UpdateMatchResultCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(UpdateMatchResultCommand request, CancellationToken cancellationToken)
        {
            // A. Buscamos el partido por GUID
            var match = await _context.Matches
                .FirstOrDefaultAsync(m => m.Id == request.MatchId, cancellationToken);

            if (match == null) return false; // No existe

            // B. Usamos TU método de la entidad (Esto es DDD puro ✅)
            // Este método ya se encarga de poner el Status = Finalized y validar negativos
            try
            {
                match.FinishMatch(request.HomeScore, request.AwayScore);
            }
            catch (Exception)
            {
                // Si el partido ya estaba finalizado o hay error de lógica, retornamos false
                // (O podrías lanzar la excepción para que el Controller la capture)
                return false;
            }

            // C. Guardamos cambios
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}