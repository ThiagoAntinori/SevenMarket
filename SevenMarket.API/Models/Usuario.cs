using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SevenMarket.API.Models;

[Table("usuarios")] // Aseguramos que apunte a la tabla en minúsculas de Postgres
public class Usuario
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string Username { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string? Rol { get; set; }

    public bool Activo { get; set; }
}