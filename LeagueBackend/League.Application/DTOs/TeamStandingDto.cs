using System;

namespace League.Application.DTOs
{
    public class TeamStandingDto
    {
        public Guid TeamId { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public int Played { get; set; }      // Partidos Jugados (PJ)
        public int Won { get; set; }         // Ganados (PG)
        public int Drawn { get; set; }       // Empatados (PE)
        public int Lost { get; set; }        // Perdidos (PP)
        public int GoalsFor { get; set; }    // Goles Favor (GF)
        public int GoalsAgainst { get; set; } // Goles Contra (GC)
        public int GoalDifference => GoalsFor - GoalsAgainst; // Dif. Goles (DG)
        public int Points { get; set; }      // Puntos (Pts)
    }
}