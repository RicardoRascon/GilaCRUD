using System.ComponentModel.DataAnnotations;

namespace GilaCRUD.Models
{
    public class Categoria
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Descripcion { get; set; }
        public float margenUtilidad { get; set; }
    }
}
