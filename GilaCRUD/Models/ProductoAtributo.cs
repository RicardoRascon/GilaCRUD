using System.ComponentModel.DataAnnotations;

namespace GilaCRUD.Models
{
    public class ProductoAtributo
    {
        [Key]
        public int Id { get; set; }
        public int ProductoId { get; set; }
        public Producto Producto { get; set; }
        public int AtributoId { get; set; }
        public Atributo Atributo { get; set; }
        public string Valor { get; set; }
    }
}
