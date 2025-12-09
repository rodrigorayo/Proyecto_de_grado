using League.Domain.Common;
using League.Domain.Enums;
using System;

namespace League.Domain.Entities
{
    public class Player : BaseEntity
    {
        public string FullName { get; private set; }
        public PlayerPosition Position { get; private set; }
        public int Number { get; private set; }
        public DateTime? BirthDate { get; private set; }
        public Guid? TeamId { get; private set; }

        // Estadísticas acumuladas (se actualizan al registrar resultados)
        public int Goals { get; private set; }
        public int Assists { get; private set; }
        public int YellowCards { get; private set; }
        public int RedCards { get; private set; }

        public Player(string fullName, PlayerPosition position, int number, DateTime? birthDate = null)
        {
            if (string.IsNullOrWhiteSpace(fullName)) throw new DomainException("Nombre del jugador requerido.");
            if (number <= 0) throw new DomainException("Número de camiseta inválido.");
            FullName = fullName.Trim();
            Position = position;
            Number = number;
            BirthDate = birthDate;
        }

        public void AssignToTeam(Guid teamId) => TeamId = teamId;

        internal void IncreaseGoal() => Goals++;
        internal void IncreaseAssist() => Assists++;
        internal void AddYellowCard() => YellowCards++;
        internal void AddRedCard() => RedCards++;
    }
}
