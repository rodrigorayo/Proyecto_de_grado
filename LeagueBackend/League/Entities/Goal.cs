using System;

namespace League.Domain.Entities
{
    public class Goal
    {
        public Guid PlayerId { get; }
        public Guid TeamId { get; }
        public int Minute { get; }

        public Goal(Guid playerId, Guid teamId, int minute)
        {
            if (minute < 0 || minute > 120) throw new Domain.Common.DomainException("Minuto inválido para gol.");
            PlayerId = playerId;
            TeamId = teamId;
            Minute = minute;
        }
    }
}
