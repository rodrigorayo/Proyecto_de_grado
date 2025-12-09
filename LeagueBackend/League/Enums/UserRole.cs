namespace League.Domain.Enums
{
    // Este enum es conceptual; la persistencia de usuarios/roles la manejará Identity en Infrastructure.
    public enum UserRole
    {
        Admin,
        Delegado,
        Arbitro
    }
}
