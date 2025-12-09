using League.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace League.Domain.Entities
{
    public class Incident
    {
        [Key]
        public int Id { get; set; } // Nuevo

        public Guid? PlayerId { get; private set; }
        public Guid? TeamId { get; private set; }
        public IncidentType Type { get; private set; }
        public int Minute { get; private set; }
        public string? Note { get; private set; } // Hacemos nullable string

        // Constructor vacío para EF Core
        protected Incident() { }

        public Incident(IncidentType type, int minute, Guid? playerId = null, Guid? teamId = null, string? note = null)
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