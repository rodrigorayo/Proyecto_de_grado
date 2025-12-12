using Microsoft.EntityFrameworkCore;
using League.Domain.Entities;
using System;

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

        public DbSet<News> News { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // =========================================================
            // 1. CONFIGURACIÓN DE USUARIOS Y ROLES (Lo que ya tenías)
            // =========================================================
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId);

            // Seed Data (Roles iniciales)
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "Admin", Description = "Full Access" },
                new Role { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "Delegate", Description = "Team Management" },
                new Role { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Referee", Description = "Match Reporting" },
                new Role { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Name = "Fan", Description = "Read Only" }
            );

            // =========================================================
            // 2. CONFIGURACIÓN DE PARTIDOS (HU-04 - NUEVO)
            // =========================================================

            // Regla: Si borras un equipo, NO borres sus partidos en cascada.
            // Esto evita el error de "Multiple cascade paths" en SQL Server.

            modelBuilder.Entity<League.Domain.Entities.Match>()
                .HasOne(m => m.HomeTeam)
                .WithMany()
                .HasForeignKey(m => m.HomeTeamId)
                .OnDelete(DeleteBehavior.Restrict); // <--- IMPORTANTE

            modelBuilder.Entity<League.Domain.Entities.Match>()
                .HasOne(m => m.AwayTeam)
                .WithMany()
                .HasForeignKey(m => m.AwayTeamId)
                .OnDelete(DeleteBehavior.Restrict); // <--- IMPORTANTE

            // El torneo sí puede borrar sus partidos en cascada
            modelBuilder.Entity<League.Domain.Entities.Match>()
                .HasOne(m => m.Tournament)
                .WithMany()
                .HasForeignKey(m => m.TournamentId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}