using GilaCRUD.Data;
using GilaCRUD.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace GilaCRUD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductoController : ControllerBase
    {
        private readonly ApplicationDBContext _db;
        public ProductoController(ApplicationDBContext db)
        {
            _db = db;
        }
        [HttpGet("Dashboard")]
        public async Task<IActionResult> Dashboard()
        {
            var lista = await _db.Productos.Include(producto => producto.Categoria).ToListAsync();
            var atributosprod = _db.ProductoAtributos.Include(pa => pa.Atributo)
                                                     .Where(pa => lista.Select(p => p.Id).ToList().Contains(pa.ProductoId))
                                                     .Select(pa => new
                                                     {
                                                         ProductoId = pa.ProductoId,
                                                         AtributoValor = pa.Atributo.Descripcion + " - " + pa.Valor,
                                                         Valor = pa.Valor
                                                     }).ToList();

            var productos = lista.Select(producto => new
            {
                ProductoId = producto.Id,
                Nombre = producto.Nombre,
                SKU = producto.SKU,
                Marca = producto.Marca,
                Costo = producto.Costo,
                Categoria = producto.Categoria.Descripcion,
                MargenUtilidad = producto.Categoria.margenUtilidad,
                precioVenta = producto.Costo + ((producto.Costo * producto.Categoria.margenUtilidad) / 100),
                atributosproductos = string.Join(",", atributosprod.Where(ap => ap.ProductoId == producto.Id).Select(ap => ap.AtributoValor).ToList())
            });
            return Ok(productos);
        }
        [HttpGet]
        public async Task<IActionResult> GetProductos()
        {
            var lista = await _db.Productos.OrderBy(c => c.Nombre).ToListAsync();

            var atributosprod = _db.ProductoAtributos.Include(pa => pa.Atributo)
                                                     .Where(pa => lista.Select(p => p.Id).ToList().Contains(pa.ProductoId))
                                                     .Select(pa => new
                                                     {
                                                         Id = pa.ProductoId,
                                                         AtributoValor = pa.Atributo.Descripcion + " - " + pa.Valor,
                                                         Valor = pa.Valor
                                                     }).ToList();

            var productos = lista.Select(producto => new
            {
                Id = producto.Id,
                Nombre = producto.Nombre,
                SKU = producto.SKU,
                Marca = producto.Marca,
                Costo = producto.Costo,
                atributosproductos = string.Join(",", atributosprod.Where(ap => ap.Id == producto.Id).Select(ap => ap.AtributoValor).ToList())
            });

            return Ok(productos);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetProducto(int id)
        {
            var obj = await _db.Productos.FirstOrDefaultAsync(c => c.Id == id);

            if (obj == null)
            {
                return NotFound();
            }

            return Ok(obj);
        }

        [HttpPost]
        public async Task<IActionResult> PostProducto([FromBody] Producto producto)
        {
            if (producto == null)
            {
                return BadRequest(ModelState);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _db.AddAsync(producto);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> PutProducto([FromRoute] int id, [FromBody] Producto producto)
        {
            if (producto == null && producto.Id <= 0 && id != producto.Id)
            {
                return BadRequest(ModelState);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var obj = await _db.Productos.FirstOrDefaultAsync(c => c.Id == id);
            obj.Nombre = producto.Nombre;
            obj.SKU = producto.SKU;
            obj.Marca = producto.Marca;
            obj.Costo = producto.Costo;
            obj.CategoriaId = producto.CategoriaId;

            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var obj = await _db.Productos.FirstOrDefaultAsync(c => c.Id == id);

            if (obj == null)
            {
                return NotFound();
            }
            _db.Productos.Remove(obj);
            await _db.SaveChangesAsync();
            return Ok(id);
        }
    }
}
