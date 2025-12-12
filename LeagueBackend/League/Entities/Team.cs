using League.Domain.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace League.Domain.Entities
{
    public class Team : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; private set; }

        [MaxLength(50)]
        public string Category { get; private set; }

        public Guid? DelegateId { get; private set; } // Referencia al usuario (delegado)

        [MaxLength(500)]
        public string? LogoUrl { get; private set; }

        // --- RELACIÓN 1:N (Un equipo pertenece a UN torneo) ---
        // Puede ser nulo (Guid?) porque al crear el equipo quizás aún no se inscribe
        public Guid? TournamentId { get; private set; }
        public virtual Tournament? Tournament { get; private set; }
        // ------------------------------------------------------

        // --- RELACIÓN 1:N (Un equipo tiene MUCHOS jugadores) ---
        private readonly List<Player> _players = new();
        public virtual IReadOnlyCollection<Player> Players => _players.AsReadOnly();

        // Constructor vacío REQUERIDO por EF Core
        protected Team() { }

        // Constructor para crear equipos nuevos
        public Team(string name, string category, Guid? delegateId = null, string logoUrl = null)
        {
            if (string.IsNullOrWhiteSpace(name)) throw new DomainException("El nombre del equipo es obligatorio.");
            Name = name.Trim();
            Category = category;
            DelegateId = delegateId;
            LogoUrl = logoUrl;
        }

        // --- MÉTODOS DE NEGOCIO ---

        public void UpdateInfo(string name, string category, Guid? delegateId, string logoUrl)
        {
            if (string.IsNullOrWhiteSpace(name)) throw new DomainException("El nombre del equipo es obligatorio.");
            Name = name.Trim();
            Category = category;
            DelegateId = delegateId;
            LogoUrl = logoUrl;
            Touch(); // Actualiza fecha de modificación
        }

        public void AssignToTournament(Guid tournamentId)
        {
            if (tournamentId == Guid.Empty) throw new DomainException("ID de torneo inválido.");
            TournamentId = tournamentId;
            Touch();
        }

        public void AddPlayer(Player player)
        {
            if (player == null) throw new DomainException("Jugador inválido.");

            // Validar si ya existe el número de camiseta
            if (_players.Any(p => p.Number == player.Number))
                throw new DomainException($"Ya existe un jugador con el número {player.Number} en el equipo.");

            // Asignar ID y agregar
            player.AssignToTeam(this.Id);
            _players.Add(player);
            Touch();
        }

        public void RemovePlayer(Guid playerId)
        {
            var p = _players.SingleOrDefault(x => x.Id == playerId);
            if (p == null) throw new DomainException("Jugador no encontrado en el equipo.");
            _players.Remove(p);
            Touch();
        }
    }
}