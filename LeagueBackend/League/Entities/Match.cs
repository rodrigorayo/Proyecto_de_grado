using League.Domain.Common;
using League.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace League.Domain.Entities
{
    public class Match : BaseEntity
    {
        public DateTime MatchDate { get; private set; }

        [MaxLength(200)]
        public string? Venue { get; private set; } // Lugar/Estadio

        public MatchStatus Status { get; private set; }

        // --- RESULTADOS (Simplificado para evitar ValueObjects complejos en EF por ahora) ---
        public int? HomeScore { get; private set; }
        public int? AwayScore { get; private set; }

        // --- RELACIONES OBLIGATORIAS ---
        [Required]
        public Guid TournamentId { get; private set; }
        public virtual Tournament? Tournament { get; private set; } // Navegación

        [Required]
        public Guid HomeTeamId { get; private set; } // Antes TeamA
        [ForeignKey("HomeTeamId")]
        public virtual Team? HomeTeam { get; private set; }

        [Required]
        public Guid AwayTeamId { get; private set; } // Antes TeamB
        [ForeignKey("AwayTeamId")]
        public virtual Team? AwayTeam { get; private set; }

        // --- ÁRBITRO (Opcional) ---
        public Guid? RefereeId { get; private set; }
        // Si tuvieras una tabla de Users/Referees, aquí iría la navegación virtual

        protected Match() { }

        // Constructor: PROGRAMAR PARTIDO
        public Match(Guid tournamentId, Guid homeTeamId, Guid awayTeamId, DateTime matchDate, string? venue, Guid? refereeId = null)
        {
            if (tournamentId == Guid.Empty) throw new DomainException("El torneo es obligatorio.");
            if (homeTeamId == Guid.Empty || awayTeamId == Guid.Empty) throw new DomainException("Los equipos son obligatorios.");
            if (homeTeamId == awayTeamId) throw new DomainException("Un equipo no puede jugar contra sí mismo.");

            TournamentId = tournamentId;
            HomeTeamId = homeTeamId;
            AwayTeamId = awayTeamId;
            MatchDate = matchDate;
            Venue = venue;
            RefereeId = refereeId;
            Status = MatchStatus.Scheduled; // Nace como programado
        }

        // --- MÉTODOS DE NEGOCIO (Cambios de Estado) ---

        // 1. Iniciar el partido (El árbitro pita el inicio)
        public void StartMatch()
        {
            if (Status != MatchStatus.Scheduled)
                throw new DomainException("Solo se puede iniciar un partido que esté programado.");

            Status = MatchStatus.InProgress;
            Touch();
        }

        // 2. Finalizar y Registrar Resultado
        public void FinishMatch(int homeScore, int awayScore)
        {
            if (Status == MatchStatus.Finalized)
                throw new DomainException("El partido ya fue finalizado anteriormente.");

            if (homeScore < 0 || awayScore < 0)
                throw new DomainException("El marcador no puede ser negativo.");

            HomeScore = homeScore;
            AwayScore = awayScore;
            Status = MatchStatus.Finalized;
            Touch();
        }

        // 3. Cancelar/Suspender
        public void CancelMatch()
        {
            Status = MatchStatus.Canceled;
            Touch();
        }

        // 4. Reprogramar (Cambiar fecha/lugar)
        public void Reschedule(DateTime newDate, string newVenue)
        {
            if (Status == MatchStatus.Finalized)
                throw new DomainException("No se puede reprogramar un partido ya jugado.");

            MatchDate = newDate;
            Venue = newVenue;
            Status = MatchStatus.Scheduled; // Vuelve a estar programado si estaba cancelado
            Touch();
        }

        // 5. Asignar Árbitro
        public void AssignReferee(Guid refereeId)
        {
            RefereeId = refereeId;
            Touch();
        }
    }
}