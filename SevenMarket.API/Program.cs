using Microsoft.EntityFrameworkCore;
using SevenMarket.API.Models;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{    
    options.AddPolicy("ProdPolicy", policy =>
    {
        policy.WithOrigins("https://sevenmarket7.netlify.app") // Tu URL de Netlify
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();


builder.Services.AddDbContext<NeondbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// if (app.Environment.IsDevelopment())
// {
// app.UseSwagger();
// app.UseSwaggerUI(c =>
// {
//     c.SwaggerEndpoint("/swagger/v1/swagger.json", "SevenMarket API V1");
//     c.RoutePrefix = "swagger";
// });
//}

app.UseCors("ProdPolicy");

//app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();


app.Run();