using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    public partial class AddCurrentOwnerToTokenEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tokens_AspNetUsers_AuthorId",
                table: "Tokens");

            migrationBuilder.AddColumn<Guid>(
                name: "CurrentOwnerId",
                table: "Tokens",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Tokens_CurrentOwnerId",
                table: "Tokens",
                column: "CurrentOwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tokens_AspNetUsers_AuthorId",
                table: "Tokens",
                column: "AuthorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tokens_AspNetUsers_CurrentOwnerId",
                table: "Tokens",
                column: "CurrentOwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tokens_AspNetUsers_AuthorId",
                table: "Tokens");

            migrationBuilder.DropForeignKey(
                name: "FK_Tokens_AspNetUsers_CurrentOwnerId",
                table: "Tokens");

            migrationBuilder.DropIndex(
                name: "IX_Tokens_CurrentOwnerId",
                table: "Tokens");

            migrationBuilder.DropColumn(
                name: "CurrentOwnerId",
                table: "Tokens");

            migrationBuilder.AddForeignKey(
                name: "FK_Tokens_AspNetUsers_AuthorId",
                table: "Tokens",
                column: "AuthorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
