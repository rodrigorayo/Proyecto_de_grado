using System;
using System.Collections.Generic;
using System.Linq;

namespace League.Domain.Entities
{
    public class MatchResult
    {
        private readonly List<Goal> _goals = new();
        private readonly List<Incident> _incidents = new();

        public IReadOnlyCollection<Goal> Goals => _goals.AsReadOnly();
        public IReadOnlyCollection<Incident> Incidents => _incidents.AsReadOnly();
        public string Observations { get; private set; }

        public void AddGoal(Goal goal)
        {
            if (goal == null) throw new Domain.Common.DomainException("Gol inválido.");
            _goals.Add(goal);
        }

        public void AddIncident(Incident incident)
        {
            if (incident == null) throw new Domain.Common.DomainException("Incidencia inválida.");
            _incidents.Add(incident);
        }

        public int GoalsForTeam(Guid teamId) => _goals.Count(g => g.TeamId == teamId);

        public void SetObservations(string obs) => Observations = obs;
    }
}
