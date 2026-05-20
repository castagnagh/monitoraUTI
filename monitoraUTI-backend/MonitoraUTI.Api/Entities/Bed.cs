using System.ComponentModel.DataAnnotations;

namespace MonitoraUTI.Api.Entities;

public class Bed
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Room { get; set; }
    public string? PatientName { get; set; }
    public string? AdmissionReason { get; set; }
    // current humidity percent (kept for quick UI access)
    public double? CurrentHumidity { get; set; }
    // computed status: Normal, Attention, Alert, Inactive
    public string HumidityStatus { get; set; } = "Normal";
    public bool IsActive { get; set; } = true;
    public bool HasHumidityAlert { get; set; } = false;
    public DateTime? LastAlertAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<HumidityEvent> Events { get; set; } = new();
}
