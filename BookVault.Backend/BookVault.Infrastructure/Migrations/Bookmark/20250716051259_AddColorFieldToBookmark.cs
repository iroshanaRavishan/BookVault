using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookVault.Infrastructure.Migrations.Bookmark
{
    /// <inheritdoc />
    public partial class AddColorFieldToBookmark : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Color",
                schema: "app",
                table: "Bookmarks",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color",
                schema: "app",
                table: "Bookmarks");
        }
    }
}
