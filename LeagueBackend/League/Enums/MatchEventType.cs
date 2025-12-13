namespace League.Domain.Enums
{
    public enum MatchEventType
    {
        Goal = 0,       // Gol normal
        YellowCard = 1, // Tarjeta Amarilla
        RedCard = 2,    // Tarjeta Roja
        OwnGoal = 3     // Gol en contra (Opcional, pero pro)
    }
}