using Microsoft.EntityFrameworkCore;
using League.Domain.Entities;
using System;
using System.Reflection;

namespace League.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // --- DbSets (Tablas) ---
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }

        public DbSet<Team> Teams { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Tournament> Tournaments { get; set; }

        // Uso explícito para evitar conflictos con 'System.Text.RegularExpressions.Match'
        public DbSet<League.Domain.Entities.Match> Matches { get; set; }

        // --- NUEVA TABLA (HU-09) ---
        public DbSet<MatchEvent> MatchEvents { get; set; }

        public DbSet<News> News { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Aplica configuraciones automáticas si tienes archivos separados
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            // =========================================================
            // 1. CONFIGURACIÓN DE USUARIOS Y ROLES
            // =========================================================
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId);

            // Seed Data
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "Admin", Description = "Full Access" },
                new Role { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "Delegate", Description = "Team Management" },
                new Role { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Referee", Description = "Match Reporting" },
                new Role { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Name = "Fan", Description = "Read Only" }
            );

            // =========================================================
            // 2. CONFIGURACIÓN DE PARTIDOS
            // =========================================================
            modelBuilder.Entity<League.Domain.Entities.Match>()
                .HasOne(m => m.HomeTeam)
                .WithMany()
                .HasForeignKey(m => m.HomeTeamId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<League.Domain.Entities.Match>()
                .HasOne(m => m.AwayTeam)
                .WithMany()
                .HasForeignKey(m => m.AwayTeamId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<League.Domain.Entities.Match>()
                .HasOne(m => m.Tournament)
                .WithMany()
                .HasForeignKey(m => m.TournamentId)
                .OnDelete(DeleteBehavior.Cascade);

            // =========================================================
            // 3. CONFIGURACIÓN DE EVENTOS DE PARTIDO (HU-09 - NUEVO)
            // =========================================================

            // Relación Partido -> Eventos
            modelBuilder.Entity<MatchEvent>()
                .HasOne(e => e.Match)
                .WithMany() // Un partido tiene muchos eventos
                .HasForeignKey(e => e.MatchId)
                .OnDelete(DeleteBehavior.Cascade); // Si borro el partido, los goles se borran.

            // Relación Jugador -> Eventos
            modelBuilder.Entity<MatchEvent>()
                .HasOne(e => e.Player)
                .WithMany()
                .HasForeignKey(e => e.PlayerId)
                .OnDelete(DeleteBehavior.Restrict); // Si borro al jugador, NO permitir si tiene goles (Integridad).
        }
    }
}