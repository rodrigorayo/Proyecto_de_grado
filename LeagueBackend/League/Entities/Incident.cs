using League.Domain.Enums;
using System;

namespace League.Domain.Entities
{
    public class Incident
    {
        public Guid? PlayerId { get; }
        public Guid? TeamId { get; }
        public IncidentType Type { get; }
        public int Minute { get; }
        public string Note { get; }

        public Incident(IncidentType type, int minute, Guid? playerId = null, Guid? teamId = null, string note = null)
        {
            if (minute < 0 || minute > 120) throw new Domain.Common.DomainException("Minuto inválido para incidencia.");
            Type = type;
            Minute = minute;
            PlayerId = playerId;
            TeamId = teamId;
            Note = note;
        }
    }
}
