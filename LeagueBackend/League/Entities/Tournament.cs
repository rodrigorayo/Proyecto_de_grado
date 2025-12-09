using League.Domain.Common;
using System;
using System.Collections.Generic;

namespace League.Domain.Entities
{
    public class Tournament : BaseEntity
    {
        public string Name { get; private set; }
        public DateTime StartDate { get; private set; }
        public DateTime? EndDate { get; private set; }

        private readonly List<Guid> _teamIds = new();
        public IReadOnlyCollection<Guid> TeamIds => _teamIds.AsReadOnly();

        public Tournament(string name, DateTime startDate)
        {
            if (string.IsNullOrWhiteSpace(name)) throw new DomainException("Nombre de torneo requerido.");
            Name = name.Trim();
            StartDate = startDate;
        }

        public void AddTeam(Guid teamId)
        {
            if (_teamIds.Contains(teamId)) throw new DomainException("Equipo ya inscrito en el torneo.");
            _teamIds.Add(teamId);
            Touch();
        }

        public void RemoveTeam(Guid teamId)
        {
            if (!_teamIds.Contains(teamId)) throw new DomainException("Equipo no inscrito.");
            _teamIds.Remove(teamId);
            Touch();
        }

        public void Close(DateTime endDate)
        {
            EndDate = endDate;
            Touch();
        }
    }
}
