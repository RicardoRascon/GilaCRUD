using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GilaCRUD.Models
{
    public class Producto
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Nombre { get; set; }

        [Required]
        public int SKU { get; set; }

        [Required]
        public string Marca { get; set; }

        [Required]
        public double Costo { get; set; }

        [Required]
        public int Stock { get; set; }

        [Required]
        public int CategoriaId { get; set; }
        public Categoria Categoria { get; set; }

        public virtual ICollection<ProductoAtributo> ProductosAtributos { get; set; }   
    }
}
