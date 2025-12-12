using League.Domain.Common;
using League.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace League.Domain.Entities
{
    public class Player : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; private set; }

        // El CI es obligatorio y servirá para validar unicidad
        [Required]
        [MaxLength(20)]
        public string CI { get; private set; }

        public PlayerPosition Position { get; private set; }

        public int Number { get; private set; }

        public DateTime? BirthDate { get; private set; }

        // RELACIONES
        [Required]
        public Guid TeamId { get; private set; }

        [ForeignKey("TeamId")]
        public virtual Team? Team { get; private set; }

        // ESTADÍSTICAS
        public int Goals { get; private set; }
        public int Assists { get; private set; }
        public int YellowCards { get; private set; }
        public int RedCards { get; private set; }

        // Constructor vacío para EF Core
        protected Player() { }

        // Constructor para CREAR
        public Player(string fullName, string ci, PlayerPosition position, int number, Guid teamId, DateTime? birthDate = null)
        {
            if (string.IsNullOrWhiteSpace(fullName)) throw new DomainException("El nombre es obligatorio.");
            if (string.IsNullOrWhiteSpace(ci)) throw new DomainException("El CI es obligatorio.");
            if (number <= 0) throw new DomainException("Número de camiseta inválido.");
            if (teamId == Guid.Empty) throw new DomainException("El jugador debe tener un equipo.");

            FullName = fullName.Trim();
            CI = ci.Trim();
            Position = position;
            Number = number;
            TeamId = teamId;
            BirthDate = birthDate;
        }

        // Método para ACTUALIZAR
        public void UpdateDetails(string fullName, string ci, int number, PlayerPosition position, DateTime? birthDate)
        {
            if (string.IsNullOrWhiteSpace(fullName)) throw new DomainException("El nombre es obligatorio.");
            if (string.IsNullOrWhiteSpace(ci)) throw new DomainException("El CI es obligatorio.");

            FullName = fullName.Trim();
            CI = ci.Trim();
            Number = number;
            Position = position;
            BirthDate = birthDate;

            Touch(); // Actualiza fecha de modificación
        }

        // Métodos de estadísticas
        public void AssignToTeam(Guid teamId) { TeamId = teamId; Touch(); }
        internal void IncreaseGoal() { Goals++; Touch(); }
        internal void IncreaseAssist() { Assists++; Touch(); }
        internal void AddYellowCard() { YellowCards++; Touch(); }
        internal void AddRedCard() { RedCards++; Touch(); }
    }
}