using MonitoraUTI.Api.Entities;

namespace MonitoraUTI.Api.Repositories;

public interface IBedRepository
{
    Task<List<Bed>> GetAllAsync();
    Task<Bed?> GetByIdAsync(int id);
    Task<Bed> AddAsync(Bed bed);
    Task UpdateAsync(Bed bed);
    Task DeleteAsync(Bed bed);
}
