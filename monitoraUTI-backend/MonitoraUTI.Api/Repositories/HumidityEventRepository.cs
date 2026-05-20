using Microsoft.EntityFrameworkCore;
using MonitoraUTI.Api.Data;
using MonitoraUTI.Api.Entities;

namespace MonitoraUTI.Api.Repositories;

public class HumidityEventRepository : IHumidityEventRepository
{
    private readonly AppDbContext _db;
    public HumidityEventRepository(AppDbContext db) => _db = db;

    public async Task AddAsync(HumidityEvent evt)
    {
        _db.HumidityEvents.Add(evt);
        await _db.SaveChangesAsync();
    }

    public async Task<List<HumidityEvent>> GetLatestAsync(int count = 10)
    {
        return await _db.HumidityEvents.OrderByDescending(e => e.DetectedAt).Take(count).Include(e => e.Bed).AsNoTracking().ToListAsync();
    }
}
