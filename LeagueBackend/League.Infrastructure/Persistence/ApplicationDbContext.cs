using League.Application.Common.Interfaces; // Para usar la interfaz
using League.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Reflection;

namespace League.Infrastructure.Persistence
{
    // 👇 AQUÍ ESTÁ LA CLAVE: ", IApplicationDbContext"
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Tournament> Tournaments { get; set; }
        public DbSet<League.Domain.Entities.Match> Matches { get; set; }
        public DbSet<MatchEvent> MatchEvents { get; set; }
        public DbSet<News> News { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            // Configuración de relaciones (Roles, Partidos, Eventos)
            modelBuilder.Entity<User>().HasOne(u => u.Role).WithMany(r => r.Users).HasForeignKey(u => u.RoleId);

            modelBuilder.Entity<Role>().HasData(
                new Role { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "Admin", Description = "Full Access" },
                new Role { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "Delegate", Description = "Team Management" },
                new Role { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Committee", Description = "Match Reporting" }
            );

            // Relaciones de Partidos y Eventos (restringimos borrado para evitar accidentes)
            modelBuilder.Entity<League.Domain.Entities.Match>().HasOne(m => m.HomeTeam).WithMany().HasForeignKey(m => m.HomeTeamId).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<League.Domain.Entities.Match>().HasOne(m => m.AwayTeam).WithMany().HasForeignKey(m => m.AwayTeamId).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<League.Domain.Entities.Match>().HasOne(m => m.Tournament).WithMany().HasForeignKey(m => m.TournamentId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<MatchEvent>().HasOne(e => e.Match).WithMany().HasForeignKey(e => e.MatchId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<MatchEvent>().HasOne(e => e.Player).WithMany().HasForeignKey(e => e.PlayerId).OnDelete(DeleteBehavior.Restrict);
        }
    }
}