using Microsoft.EntityFrameworkCore;
using MonitoraUTI.Api.Entities;

namespace MonitoraUTI.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Bed> Beds => Set<Bed>();
    public DbSet<HumidityEvent> HumidityEvents => Set<HumidityEvent>();
}
