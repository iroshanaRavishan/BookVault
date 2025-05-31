using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookVault.Migrations
{
    /// <inheritdoc />
    public partial class InitilCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "app");

            migrationBuilder.CreateTable(
                name: "Books",
                schema: "app",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Genre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ReleaseDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Author = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Plot = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    Length = table.Column<int>(type: "integer", nullable: true),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    ReadUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    CoverImagePath = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    PdfFilePath = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Books", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Books_Author",
                schema: "app",
                table: "Books",
                column: "Author");

            migrationBuilder.CreateIndex(
                name: "IX_Books_Genre",
                schema: "app",
                table: "Books",
                column: "Genre");

            migrationBuilder.CreateIndex(
                name: "IX_Books_Name",
                schema: "app",
                table: "Books",
                column: "Name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Books",
                schema: "app");
        }
    }
}
