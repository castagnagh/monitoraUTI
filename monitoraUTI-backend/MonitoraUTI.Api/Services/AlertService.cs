using MonitoraUTI.Api.DTOs;
using MonitoraUTI.Api.Entities;
using MonitoraUTI.Api.Repositories;

namespace MonitoraUTI.Api.Services;

public class AlertService : IAlertService
{
    private readonly IBedRepository _beds;
    private readonly IHumidityEventRepository _events;

    public AlertService(IBedRepository beds, IHumidityEventRepository events)
    {
        _beds = beds;
        _events = events;
    }

    public async Task ReceiveAlertAsync(AlertDto dto)
    {
        var bed = await _beds.GetByIdAsync(dto.BedId) ?? throw new Exception("Bed not found");

        // compute status based on humidity thresholds
        var humidity = dto.HumidityValue;
        string status;
        bool alert = false;
        if (!bed.IsActive)
        {
            status = "Desativada";
        }
        else if (humidity <= 40) { status = "Normal"; }
        else if (humidity <= 70) { status = "Atenção"; }
        else { status = "Alerta"; alert = true; }

        bed.CurrentHumidity = humidity;
        bed.HumidityStatus = status;
        bed.HasHumidityAlert = alert;
        bed.LastAlertAt = alert ? DateTime.UtcNow : bed.LastAlertAt;
        await _beds.UpdateAsync(bed);

        var evt = new HumidityEvent { BedId = dto.BedId, HumidityValue = dto.HumidityValue, DetectedAt = DateTime.UtcNow };
        await _events.AddAsync(evt);
    }

    public async Task<List<object>> GetLatestAlertsAsync(int count = 10)
    {
        var list = await _events.GetLatestAsync(count);
        return list.Select(e => new { e.Id, e.BedId, e.DetectedAt, e.HumidityValue, BedName = e.Bed?.Name }).Cast<object>().ToList();
    }
}
