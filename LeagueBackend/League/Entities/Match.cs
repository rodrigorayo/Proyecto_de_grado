using League.Domain.Common;
using League.Domain.Enums;
using League.Domain.Events;
using System;

namespace League.Domain.Entities
{
    public class Match : BaseEntity
    {
        public Guid TeamAId { get; private set; }
        public Guid TeamBId { get; private set; }
        public DateTime Date { get; private set; }
        public string Venue { get; private set; }
        public MatchStatus Status { get; private set; }
        public Guid? RefereeId { get; private set; }
        public MatchResult Result { get; private set; }
        public Guid? TournamentId { get; private set; }

        public Match(Guid teamAId, Guid teamBId, DateTime date, string venue, Guid? tournamentId = null, Guid? refereeId = null)
        {
            if (teamAId == Guid.Empty || teamBId == Guid.Empty) throw new DomainException("Equipos inválidos.");
            if (teamAId == teamBId) throw new DomainException("Los equipos deben ser distintos.");
            TeamAId = teamAId;
            TeamBId = teamBId;
            Date = date;
            Venue = venue;
            TournamentId = tournamentId;
            RefereeId = refereeId;
            Status = MatchStatus.Scheduled;
        }

        public void AssignReferee(Guid refereeId)
        {
            RefereeId = refereeId;
            Touch();
        }

        /// <summary>
        /// Registra el resultado del partido.
        /// La entidad valida que haya árbitro asignado y que quien registra sea el árbitro asignado (comparación por id).
        /// </summary>
        public void RegisterResult(MatchResult result, Guid performedBy)
        {
            if (result == null) throw new DomainException("Resultado inválido.");
            if (Status == MatchStatus.Finalized) throw new DomainException("El partido ya está finalizado.");
            if (RefereeId == null) throw new DomainException("No hay árbitro asignado al partido.");
            if (RefereeId != performedBy) throw new DomainException("Solo el árbitro asignado puede registrar el resultado.");

            Result = result;
            Status = MatchStatus.Finalized;
            Touch();

            // Domain event
            AddDomainEvent(new ResultRegisteredEvent(this.Id, TeamAId, TeamBId));
        }
    }
}
