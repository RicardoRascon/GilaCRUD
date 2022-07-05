using System.ComponentModel.DataAnnotations;

namespace GilaCRUD.Models
{
    public class Atributo
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Descripcion { get; set; }
        [Required]
        public int CategoriaId { get; set; }
        public Categoria Categoria { get; set; }
    }
}
