using Microsoft.EntityFrameworkCore;
using League.Domain.Entities;

namespace League.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // DbSets (Nombres de tablas en plural en Inglés)
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }

        public DbSet<Team> Teams { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Tournament> Tournaments { get; set; }

        // Uso explícito para evitar conflictos
        public DbSet<League.Domain.Entities.Match> Matches { get; set; }

        public DbSet<News> News { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de la relación User -> Role
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId);

            // Semilla de Datos (Seed Data) para Roles iniciales
            // IMPORTANTE: Como usamos BaseEntity, los Ids son GUIDs.
            // Generamos Guids fijos para que no cambien en cada ejecución.

            modelBuilder.Entity<Role>().HasData(
                new Role { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "Admin", Description = "Full Access" },
                new Role { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "Delegate", Description = "Team Management" },
                new Role { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Referee", Description = "Match Reporting" },
                new Role { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Name = "Fan", Description = "Read Only" }
            );
        }
    }
}