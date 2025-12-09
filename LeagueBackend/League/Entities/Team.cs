using League.Domain.Common;
using League.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;

namespace League.Domain.Entities
{
    public class Team : BaseEntity
    {
        public string Name { get; private set; }
        public string Category { get; private set; } // categoría / división
        public Guid? DelegateId { get; private set; } // referencia al usuario delegado (user id)
        public string LogoUrl { get; private set; }

        private readonly List<Player> _players = new();
        public IReadOnlyCollection<Player> Players => _players.AsReadOnly();

        public Team(string name, string category, Guid? delegateId = null, string logoUrl = null)
        {
            if (string.IsNullOrWhiteSpace(name)) throw new DomainException("El nombre del equipo es obligatorio.");
            Name = name.Trim();
            Category = category;
            DelegateId = delegateId;
            LogoUrl = logoUrl;
        }

        public void UpdateInfo(string name, string category, Guid? delegateId, string logoUrl)
        {
            if (string.IsNullOrWhiteSpace(name)) throw new DomainException("El nombre del equipo es obligatorio.");
            Name = name.Trim();
            Category = category;
            DelegateId = delegateId;
            LogoUrl = logoUrl;
            Touch();
        }

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
