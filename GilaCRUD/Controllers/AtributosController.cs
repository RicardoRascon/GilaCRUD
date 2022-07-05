using GilaCRUD.Data;
using GilaCRUD.Models;
using GilaCRUD.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GilaCRUD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AtributosController : ControllerBase
    {
        private readonly ApplicationDBContext _db;
        public AtributosController(ApplicationDBContext db)
        {
            _db = db;
        }
        [HttpGet]
        public async Task<IActionResult> GetAtributos()
        {
            var lista = await _db.Atributos.OrderBy(c => c.Descripcion).ToListAsync();

            return Ok(lista);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetAtributo(int id)
        {
            var obj = await _db.Atributos.FirstOrDefaultAsync(c => c.Id == id);

            if (obj == null)
            {
                return NotFound();
            }

            return Ok(obj);
        }

        [HttpGet("GetAtributosCategorias/{categoriaId:int}/{productoId:int}")]
        public IActionResult GetAtributosCategorias(int categoriaId, int productoId)
        {

            if (categoriaId > 0)
            {
                var dbAtributos =  _db.Atributos.Where(at => at.CategoriaId == categoriaId).ToList();
                var dbProductosAtributos = _db.ProductoAtributos.Where(pa => pa.ProductoId == productoId).ToList();

                if(dbProductosAtributos.Count > 0)
                {
                    var atributos = from at in dbAtributos
                                    join pa in dbProductosAtributos.DefaultIfEmpty() on at.Id equals pa.AtributoId into productosGroup
                                    from productos in productosGroup.DefaultIfEmpty()
                                    select new ViewProductosAtributos
                                    {
                                        Id = productos.Id,
                                        AtributoId = productos.AtributoId,
                                        ProductoId = productos.ProductoId,
                                        AtributoDesc = productos.Atributo.Descripcion,
                                        Valor = productos.Valor == null ? "" : productos.Valor.ToString(),
                                    };

                    return Ok(atributos);
                }else
                {
                    var atributos = dbAtributos.Select(dba => new ViewProductosAtributos
                    {
                        Id = 0,
                        AtributoId = dba.Id,
                        ProductoId = productoId,
                        AtributoDesc = dba.Descripcion,
                        Valor = ""
                    }).ToList();
                    return Ok(atributos);
                }
            }else
            {
                return Ok();
            }
        }

        [HttpPost]
        public async Task<IActionResult> PostAtributo([FromBody] Atributo atributo)
        {
            if (atributo == null)
            {
                return BadRequest(ModelState);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _db.AddAsync(atributo);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> PutAtributo([FromRoute] int id, [FromBody] Atributo atributo)
        {
            if (atributo == null && atributo.Id <= 0 && id != atributo.Id)
            {
                return BadRequest(ModelState);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var obj = await _db.Atributos.FirstOrDefaultAsync(c => c.Id == id);
            obj.Descripcion = atributo.Descripcion;
            obj.CategoriaId = atributo.CategoriaId;
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAtributo(int id)
        {
            var obj = await _db.Atributos.FirstOrDefaultAsync(c => c.Id == id);

            if (obj == null)
            {
                return NotFound();
            }
            _db.Atributos.Remove(obj);
            await _db.SaveChangesAsync();
            return Ok(id);
        }
    }
}
