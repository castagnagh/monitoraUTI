using Microsoft.EntityFrameworkCore;
using MonitoraUTI.Api.Data;
using MonitoraUTI.Api.Repositories;
using MonitoraUTI.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls(
    "http://0.0.0.0:58943",
    "https://localhost:58942"
);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default") ?? "Data Source=monitora.db"));

builder.Services.AddScoped<IBedRepository, BedRepository>();
builder.Services.AddScoped<IHumidityEventRepository, HumidityEventRepository>();
builder.Services.AddScoped<IBedService, BedService>();
builder.Services.AddScoped<IAlertService, AlertService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:5173").AllowCredentials();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    SchemaUpdater.EnsureCompatibility(db);
    SeedData.Initialize(db);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.MapControllers();

app.Run();
