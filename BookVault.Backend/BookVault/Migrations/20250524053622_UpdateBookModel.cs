using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookVault.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBookModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Books_Genre",
                schema: "app",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "Genre",
                schema: "app",
                table: "Books");

            migrationBuilder.AddColumn<string>(
                name: "Genres",
                schema: "app",
                table: "Books",
                type: "jsonb",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Books_Genres",
                schema: "app",
                table: "Books",
                column: "Genres")
                .Annotation("Npgsql:IndexMethod", "gin");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Books_Genres",
                schema: "app",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "Genres",
                schema: "app",
                table: "Books");

            migrationBuilder.AddColumn<string>(
                name: "Genre",
                schema: "app",
                table: "Books",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Books_Genre",
                schema: "app",
                table: "Books",
                column: "Genre");
        }
    }
}
