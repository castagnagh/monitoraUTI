using MonitoraUTI.Api.DTOs;

namespace MonitoraUTI.Api.Services;

public interface IBedService
{
    Task<List<BedDto>> GetAllAsync();
    Task<BedDto?> GetByIdAsync(int id);
    Task<BedDto> CreateAsync(CreateBedDto dto);
    Task UpdateAsync(int id, UpdateBedDto dto);
    Task DeleteAsync(int id);
    Task ClearAlertAsync(int id);
    Task ToggleActiveAsync(int id);
}
