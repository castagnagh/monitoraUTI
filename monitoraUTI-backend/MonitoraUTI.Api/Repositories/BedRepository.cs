using Microsoft.EntityFrameworkCore;
using MonitoraUTI.Api.Data;
using MonitoraUTI.Api.Entities;

namespace MonitoraUTI.Api.Repositories;

public class BedRepository : IBedRepository
{
    private readonly AppDbContext _db;
    public BedRepository(AppDbContext db) => _db = db;

    public async Task<List<Bed>> GetAllAsync() => await _db.Beds.AsNoTracking().ToListAsync();

    public async Task<Bed?> GetByIdAsync(int id) => await _db.Beds.FindAsync(id);

    public async Task<Bed> AddAsync(Bed bed)
    {
        _db.Beds.Add(bed);
        await _db.SaveChangesAsync();
        return bed;
    }

    public async Task UpdateAsync(Bed bed)
    {
        _db.Beds.Update(bed);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Bed bed)
    {
        _db.Beds.Remove(bed);
        await _db.SaveChangesAsync();
    }
}
