using GilaCRUD.Models;
using Microsoft.EntityFrameworkCore;

namespace GilaCRUD.Data
{
    public class ApplicationDBContext :DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> option) : base(option)
        {

        }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Atributo> Atributos { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<ProductoAtributo> ProductoAtributos { get; set; }

    }
}
