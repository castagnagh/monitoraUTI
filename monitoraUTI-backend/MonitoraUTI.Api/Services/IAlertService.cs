using MonitoraUTI.Api.DTOs;

namespace MonitoraUTI.Api.Services;

public interface IAlertService
{
    Task ReceiveAlertAsync(AlertDto dto);
    Task<List<object>> GetLatestAlertsAsync(int count = 10);
}
