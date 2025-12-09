using System;

namespace League.Domain.Events
{
    public class ResultRegisteredEvent
    {
        public Guid MatchId { get; }
        public Guid TeamAId { get; }
        public Guid TeamBId { get; }
        public DateTime OccurredAt { get; } = DateTime.UtcNow;

        public ResultRegisteredEvent(Guid matchId, Guid teamAId, Guid teamBId)
        {
            MatchId = matchId;
            TeamAId = teamAId;
            TeamBId = teamBId;
        }
    }
}
