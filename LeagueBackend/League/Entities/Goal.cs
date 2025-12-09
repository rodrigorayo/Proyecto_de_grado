using System;
using System.ComponentModel.DataAnnotations; // Necesario para [Key]

namespace League.Domain.Entities
{
    public class Goal
    {
        [Key]
        public int Id { get; set; } // Nuevo: Necesario para la base de datos

        // Agregamos 'private set' para que EF pueda escribir aquí
        public Guid PlayerId { get; private set; }
        public Guid TeamId { get; private set; }
        public int Minute { get; private set; }

        // Constructor vacío para EF Core
        protected Goal() { }

        // Tu constructor original
        public Goal(Guid playerId, Guid teamId, int minute)
        {
            if (minute < 0 || minute > 120) throw new Domain.Common.DomainException("Minuto inválido para gol.");
            PlayerId = playerId;
            TeamId = teamId;
            Minute = minute;
        }
    }
}