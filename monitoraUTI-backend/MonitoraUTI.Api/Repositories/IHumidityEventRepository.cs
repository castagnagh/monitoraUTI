using MonitoraUTI.Api.Entities;

namespace MonitoraUTI.Api.Repositories;

public interface IHumidityEventRepository
{
    Task AddAsync(HumidityEvent evt);
    Task<List<HumidityEvent>> GetLatestAsync(int count = 10);
}
