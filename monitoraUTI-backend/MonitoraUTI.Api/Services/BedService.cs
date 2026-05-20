using MonitoraUTI.Api.DTOs;
using MonitoraUTI.Api.Entities;
using MonitoraUTI.Api.Repositories;

namespace MonitoraUTI.Api.Services;

public class BedService : IBedService
{
    private readonly IBedRepository _beds;
    private readonly IHumidityEventRepository _events;

    public BedService(IBedRepository beds, IHumidityEventRepository events)
    {
        _beds = beds;
        _events = events;
    }

    public async Task<BedDto> CreateAsync(CreateBedDto dto)
    {
        var bed = new Bed { Name = dto.Name, Room = dto.Room, PatientName = dto.PatientName, AdmissionReason = dto.AdmissionReason };
        await _beds.AddAsync(bed);
        return ToDto(bed);
    }

    public async Task DeleteAsync(int id)
    {
        var bed = await _beds.GetByIdAsync(id) ?? throw new Exception("Bed not found");
        await _beds.DeleteAsync(bed);
    }

    public async Task<List<BedDto>> GetAllAsync() => (await _beds.GetAllAsync()).Select(ToDto).ToList();

    public async Task<BedDto?> GetByIdAsync(int id) => ToDto(await _beds.GetByIdAsync(id));

    public async Task UpdateAsync(int id, UpdateBedDto dto)
    {
        var bed = await _beds.GetByIdAsync(id) ?? throw new Exception("Bed not found");
        bed.Name = dto.Name;
        bed.Room = dto.Room;
        bed.PatientName = dto.PatientName;
        bed.AdmissionReason = dto.AdmissionReason;
        bed.IsActive = dto.IsActive;
        await _beds.UpdateAsync(bed);
    }

    public async Task ClearAlertAsync(int id)
    {
        var bed = await _beds.GetByIdAsync(id) ?? throw new Exception("Bed not found");
        bed.HasHumidityAlert = false;
        bed.LastAlertAt = null;
        bed.HumidityStatus = "Normal";
        bed.CurrentHumidity = null;
        await _beds.UpdateAsync(bed);
    }

    public async Task ToggleActiveAsync(int id)
    {
        var bed = await _beds.GetByIdAsync(id) ?? throw new Exception("Bed not found");
        bed.IsActive = !bed.IsActive;
        await _beds.UpdateAsync(bed);
    }

    private static BedDto ToDto(Bed? b) => b == null ? null! : new BedDto(
        b.Id,
        b.Name,
        b.Room,
        b.PatientName,
        b.AdmissionReason,
        b.IsActive,
        b.HasHumidityAlert,
        b.CurrentHumidity,
        b.HumidityStatus ?? "Normal",
        b.LastAlertAt,
        b.CreatedAt
    );
}
