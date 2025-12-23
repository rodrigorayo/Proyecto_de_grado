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

        // --- RESULTADOS ---
        public int? HomeScore { get; private set; } // Lo mantengo nullable como lo tenías
        public int? AwayScore { get; private set; } // Lo mantengo nullable como lo tenías

        // 👇 PROPIEDAD AGREGADA PARA LA IA
        [MaxLength(4000)]
        public string? Chronicle { get; private set; }

        // 👇 PROPIEDAD AGREGADA PARA EL ÁRBITRO
        [MaxLength(1000)]
        public string? Incidents { get; private set; }

        // --- RELACIONES OBLIGATORIAS ---
        [Required]
        public Guid TournamentId { get; private set; }
        public virtual Tournament? Tournament { get; private set; }

        [Required]
        public Guid HomeTeamId { get; private set; }
        [ForeignKey("HomeTeamId")]
        public virtual Team? HomeTeam { get; private set; }

        [Required]
        public Guid AwayTeamId { get; private set; }
        [ForeignKey("AwayTeamId")]
        public virtual Team? AwayTeam { get; private set; }

        // --- ÁRBITRO (Tu código original) ---
        public Guid? RefereeId { get; private set; }

        protected Match() { }

        // Constructor Original (INTACTO)
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
            Status = MatchStatus.Scheduled;
        }

        // --- MÉTODOS DE NEGOCIO ---

        // 1. Iniciar Partido (Tu código original)
        public void StartMatch()
        {
            if (Status != MatchStatus.Scheduled)
                throw new DomainException("Solo se puede iniciar un partido que esté programado.");

            Status = MatchStatus.InProgress;
            Touch();
        }

        // 2. Finalizar (Tu código original + Ajuste de Enum)
        public void FinishMatch(int homeScore, int awayScore)
        {
            // Nota: Cambié 'Finalized' por 'Finished' para coincidir con el Enum nuevo.
            if (Status == MatchStatus.Finished)
                throw new DomainException("El partido ya fue finalizado anteriormente.");

            if (homeScore < 0 || awayScore < 0)
                throw new DomainException("El marcador no puede ser negativo.");

            HomeScore = homeScore;
            AwayScore = awayScore;
            Status = MatchStatus.Finished;
            Touch();
        }

        // 👇 2.5 NUEVO MÉTODO: Finalizar CON Incidencias (Necesario para el reporte completo)
        public void UpdateResultDetails(int homeScore, int awayScore, string? incidents)
        {
            HomeScore = homeScore;
            AwayScore = awayScore;
            Incidents = incidents; // Guardamos lo que escribió el árbitro
            Status = MatchStatus.Finished;
            Touch();
        }

        // 3. Cancelar (Tu código original)
        public void CancelMatch()
        {
            Status = MatchStatus.Canceled;
            Touch();
        }

        // 4. Reprogramar (Tu código original)
        public void Reschedule(DateTime newDate, string newVenue)
        {
            if (Status == MatchStatus.Finished)
                throw new DomainException("No se puede reprogramar un partido ya jugado.");

            MatchDate = newDate;
            Venue = newVenue;
            Status = MatchStatus.Scheduled;
            Touch();
        }

        // 5. Asignar Árbitro (Tu código original)
        public void AssignReferee(Guid refereeId)
        {
            RefereeId = refereeId;
            Touch();
        }

        // 6. Actualizar Crónica IA (Tu código original)
        public void UpdateChronicle(string text)
        {
            Chronicle = text;
            Touch();
        }
    }
}