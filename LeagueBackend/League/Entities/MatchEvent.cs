using League.Domain.Common;
using League.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace League.Domain.Entities
{
    public class MatchEvent : BaseEntity
    {
        [Required]
        public Guid MatchId { get; private set; }
        // Navegación (sin FK restrictiva para evitar ciclos complejos, solo referencia)
        public virtual Match? Match { get; private set; }

        [Required]
        public Guid PlayerId { get; private set; }
        public virtual Player? Player { get; private set; }

        public MatchEventType Type { get; private set; }

        [Range(0, 150)] // Minutos posibles (incluyendo descuentos/prórroga)
        public int Minute { get; private set; }

        protected MatchEvent() { }

        public MatchEvent(Guid matchId, Guid playerId, MatchEventType type, int minute)
        {
            if (matchId == Guid.Empty) throw new DomainException("El evento debe pertenecer a un partido.");
            if (playerId == Guid.Empty) throw new DomainException("El evento debe tener un protagonista (jugador).");
            if (minute < 0) throw new DomainException("El minuto no puede ser negativo.");

            MatchId = matchId;
            PlayerId = playerId;
            Type = type;
            Minute = minute;
        }
    }
}