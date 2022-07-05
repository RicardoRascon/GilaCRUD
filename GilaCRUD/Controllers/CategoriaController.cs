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
    public class CategoriaController : ControllerBase
    {
        private readonly ApplicationDBContext _db;

        public CategoriaController(ApplicationDBContext db)
        {
            _db = db;

        }

        [HttpGet]
        public async Task<IActionResult> GetCategorias()
        {
            var lista = await _db.Categorias.OrderBy(c => c.Descripcion).ToListAsync();

            return Ok(lista);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetCategoria(int id)
        {
            var obj = await _db.Categorias.FirstOrDefaultAsync(c => c.Id == id);

            if(obj == null)
            {
                return NotFound();
            }

            return Ok(obj);
        }

        [HttpPost]
        public async Task<IActionResult> PostCategoria([FromBody] Categoria categoria)
        {
            if (categoria == null)
            {
                return BadRequest(ModelState);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _db.AddAsync(categoria);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> PutCategoria([FromRoute]int id,[FromBody] Categoria categoria)
        {
            if (categoria == null && categoria.Id <= 0 && id != categoria.Id)
            {
                return BadRequest(ModelState);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var obj = await _db.Categorias.FirstOrDefaultAsync(c => c.Id == id);
            obj.Descripcion=categoria.Descripcion;
            obj.margenUtilidad=categoria.margenUtilidad;
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            var obj = await _db.Categorias.FirstOrDefaultAsync(c => c.Id == id);

            if (obj == null)
            {
                return NotFound();
            }
            _db.Categorias.Remove(obj);
            await _db.SaveChangesAsync();
            return Ok(id);
        }

    }
}
