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

        public Guid? DelegateId { get; private set; }

        [MaxLength(500)]
        public string? LogoUrl { get; private set; }

        // --- NUEVO: Soft Delete (Estado Activo/Inactivo) ---
        public bool IsActive { get; private set; } = true;
        // ---------------------------------------------------

        // Relaciones
        public Guid? TournamentId { get; private set; }
        public virtual Tournament? Tournament { get; private set; }

        private readonly List<Player> _players = new();
        public virtual IReadOnlyCollection<Player> Players => _players.AsReadOnly();

        // Constructor vacío
        protected Team() { }

        // Constructor principal
        public Team(string name, string category, Guid? delegateId = null, string logoUrl = null)
        {
            if (string.IsNullOrWhiteSpace(name)) throw new DomainException("El nombre del equipo es obligatorio.");
            Name = name.Trim();
            Category = category;
            DelegateId = delegateId;
            LogoUrl = logoUrl;
            IsActive = true; // Nace activo por defecto
        }

        // --- MÉTODOS DE NEGOCIO ---

        public void UpdateInfo(string name, string category, Guid? delegateId, string logoUrl)
        {
            if (string.IsNullOrWhiteSpace(name)) throw new DomainException("El nombre del equipo es obligatorio.");
            Name = name.Trim();
            Category = category;
            DelegateId = delegateId;
            LogoUrl = logoUrl;
            Touch();
        }

        public void AssignToTournament(Guid tournamentId)
        {
            if (tournamentId == Guid.Empty) throw new DomainException("ID de torneo inválido.");
            TournamentId = tournamentId;
            Touch();
        }

        // --- NUEVO: Alternar Estado (En lugar de borrar) ---
        public void ToggleStatus()
        {
            IsActive = !IsActive; // Si es true -> false, si es false -> true
            Touch();
        }
        // ---------------------------------------------------

        public void AddPlayer(Player player)
        {
            if (player == null) throw new DomainException("Jugador inválido.");
            if (_players.Any(p => p.Number == player.Number))
                throw new DomainException($"Ya existe un jugador con el número {player.Number} en el equipo.");

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