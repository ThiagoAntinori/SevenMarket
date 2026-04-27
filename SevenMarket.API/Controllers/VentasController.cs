using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SevenMarket.API.Models;

namespace SevenMarket.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VentasController : ControllerBase
{
    private readonly NeondbContext _context;

    public VentasController(NeondbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> PostVenta([FromBody] Venta ventaRequest)
    {
        
        ventaRequest.Id = 0; 
        
        if (ventaRequest.VentaDetalles != null)
        {
            foreach (var detalle in ventaRequest.VentaDetalles)
            {
                detalle.Id = 0;
                detalle.IdVenta = 0;
            }
        }

        try
        {
            _context.Ventas.Add(ventaRequest);
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Venta registrada!", id = ventaRequest.Id });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message, detalle = ex.InnerException?.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Venta>>> GetVentas()
    {
        return await _context.Ventas
            .Include(v => v.VentaDetalles)
            .OrderByDescending(v => v.FechaHora)
            .ToListAsync();
    }


    [HttpGet("historial")]
    public async Task<ActionResult> GetHistorial([FromQuery] int n = 10)
    {
        var historial = await _context.Ventas
            .OrderByDescending(v => v.FechaHora)
            .Take(n)
            .Select(v => new {
                v.Id,
                v.FechaHora,
                v.Total,
                v.MetodoPago
            })
            .ToListAsync();
        return Ok(historial);
    }

    [HttpGet("cierre-diario")]
    public async Task<ActionResult> GetCierreDiario()
    {
        var hoy = DateTime.Today;
        var ventasHoy = await _context.Ventas
            .Where(v => v.FechaHora >= hoy)
            .ToListAsync();

        var informe = new {
            Fecha = hoy,
            TotalEfectivo = ventasHoy.Where(v => v.MetodoPago == "Efectivo").Sum(v => v.Total),
            TotalMercadoPago = ventasHoy.Where(v => v.MetodoPago == "Mercado Pago").Sum(v => v.Total),
            CantidadVentas = ventasHoy.Count,
            TotalGeneral = ventasHoy.Sum(v => v.Total)
        };

        return Ok(informe);
    }
}