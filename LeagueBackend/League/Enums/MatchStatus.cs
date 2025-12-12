namespace League.Domain.Enums
{
    public enum MatchStatus
    {
        Scheduled = 0,  // Programado (Aún no inicia)
        InProgress = 1, // En Juego (Durante el partido)
        Finalized = 2,  // Finalizado (Ya hay resultado oficial)
        Canceled = 3    // Suspendido/Cancelado
    }
}