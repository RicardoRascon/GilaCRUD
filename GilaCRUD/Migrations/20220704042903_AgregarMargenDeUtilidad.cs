using Microsoft.EntityFrameworkCore.Migrations;

namespace GilaCRUD.Migrations
{
    public partial class AgregarMargenDeUtilidad : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "margenUtilidad",
                table: "Categorias",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "margenUtilidad",
                table: "Categorias");
        }
    }
}
