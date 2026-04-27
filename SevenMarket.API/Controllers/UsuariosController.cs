using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SevenMarket.API.Models;

namespace SevenMarket.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsuariosController : ControllerBase
{
    private readonly NeondbContext _context;
    public UsuariosController(NeondbContext context) => _context = context;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] Usuario login)
    {
        var user = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Username == login.Username && u.PasswordHash == login.PasswordHash);

        if (user == null) return Unauthorized();
        return Ok(new { mensaje = "Acceso concedido" });
    }
}