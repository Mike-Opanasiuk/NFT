using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    public partial class RemoveTokenCurrencyPropAndChangePicToImgProp : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Currency",
                table: "Tokens");

            migrationBuilder.RenameColumn(
                name: "Picture",
                table: "Tokens",
                newName: "Image");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Image",
                table: "Tokens",
                newName: "Picture");

            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "Tokens",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
