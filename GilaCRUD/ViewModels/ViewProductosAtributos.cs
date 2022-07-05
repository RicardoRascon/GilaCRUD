using GilaCRUD.Models;

namespace GilaCRUD.ViewModels
{
    public class ViewProductosAtributos
    {
        public int Id { get; set; }
        public int ProductoId { get; set; }
        public int AtributoId { get; set; }
        public string AtributoDesc { get; set; }
        public string Valor { get; set; }
        public Producto Producto { get; set; }
        public Atributo Atributo { get; set; }
    }
}
