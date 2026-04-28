using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SevenMarket.API.Models;

namespace SevenMarket.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriasController : ControllerBase
{
    private readonly NeondbContext _context;

    public CategoriasController(NeondbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
    {
        return await _context.Categorias.OrderBy(c => c.Nombre).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
    {
        _context.Categorias.Add(categoria);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCategorias), new { id = categoria.Id }, categoria);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutCategoria(int id, Categoria categoria)
    {
        if (id != categoria.Id) return BadRequest();
        _context.Entry(categoria).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategoria(int id)
    {
        var categoria = await _context.Categorias.FindAsync(id);
        if (categoria == null) return NotFound();

        var tieneProductos = await _context.Productos.AnyAsync(p => p.IdCategoria == id);
        if (tieneProductos) return BadRequest(new { mensaje = "No se puede eliminar una categoría que tiene productos asociados." });

        categoria.Activo = false;
        _context.Entry(categoria).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}