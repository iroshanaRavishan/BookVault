using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookVault.Infrastructure.Migrations.Appearance
{
    /// <inheritdoc />
    public partial class InitialMigrationOfAppearanceDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "app");

            migrationBuilder.CreateTable(
                name: "Appearances",
                schema: "app",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Color = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    MarginEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    Brightness = table.Column<double>(type: "double precision", nullable: false),
                    IsDarkTheme = table.Column<bool>(type: "boolean", nullable: false),
                    IsDimmed = table.Column<bool>(type: "boolean", nullable: false),
                    IsFocusMode = table.Column<bool>(type: "boolean", nullable: false),
                    IsAutoThemeEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    FromTime = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ToTime = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appearances", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Appearances",
                schema: "app");
        }
    }
}
