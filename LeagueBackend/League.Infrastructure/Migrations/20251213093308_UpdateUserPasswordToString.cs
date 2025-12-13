using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace League.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserPasswordToString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "CreatedAt",
                value: new DateTime(2025, 12, 13, 9, 33, 7, 722, DateTimeKind.Utc).AddTicks(269));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "CreatedAt",
                value: new DateTime(2025, 12, 13, 9, 33, 7, 722, DateTimeKind.Utc).AddTicks(310));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                columns: new[] { "CreatedAt", "Name" },
                values: new object[] { new DateTime(2025, 12, 13, 9, 33, 7, 722, DateTimeKind.Utc).AddTicks(355), "Committee" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "CreatedAt",
                value: new DateTime(2025, 12, 13, 9, 4, 19, 450, DateTimeKind.Utc).AddTicks(8637));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "CreatedAt",
                value: new DateTime(2025, 12, 13, 9, 4, 19, 450, DateTimeKind.Utc).AddTicks(8662));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                columns: new[] { "CreatedAt", "Name" },
                values: new object[] { new DateTime(2025, 12, 13, 9, 4, 19, 450, DateTimeKind.Utc).AddTicks(8669), "Referee" });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "CreatedAt", "Description", "Name", "UpdatedAt" },
                values: new object[] { new Guid("44444444-4444-4444-4444-444444444444"), new DateTime(2025, 12, 13, 9, 4, 19, 450, DateTimeKind.Utc).AddTicks(8675), "Read Only", "Fan", null });
        }
    }
}
