using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookVault.Infrastructure.Migrations.Bookmark
{
    /// <inheritdoc />
    public partial class AddThumbnaiSourceAndThumbnailImageFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BookmarkThumbnailPath",
                schema: "app",
                table: "Bookmarks",
                newName: "BookmarkThumbnailSourcePath");

            migrationBuilder.AddColumn<string>(
                name: "BookmarkThumbnailImagePath",
                schema: "app",
                table: "Bookmarks",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BookmarkThumbnailImagePath",
                schema: "app",
                table: "Bookmarks");

            migrationBuilder.RenameColumn(
                name: "BookmarkThumbnailSourcePath",
                schema: "app",
                table: "Bookmarks",
                newName: "BookmarkThumbnailPath");
        }
    }
}
