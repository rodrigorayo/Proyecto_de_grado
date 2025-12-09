using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace League.Domain.Entities
{
    public class MatchResult
    {
        [Key]
        public int Id { get; set; } // Nuevo

        // Cambiamos List a virtual ICollection para mejor soporte de EF (opcional pero recomendado)
        private readonly List<Goal> _goals = new();
        private readonly List<Incident> _incidents = new();

        // EF Core necesita acceso a las colecciones. 
        // Exponemos la lista para navegación
        public virtual ICollection<Goal> Goals => _goals;
        public virtual ICollection<Incident> Incidents => _incidents;

        public string? Observations { get; private set; }

        // Constructor vacío para EF
        public MatchResult() { }

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