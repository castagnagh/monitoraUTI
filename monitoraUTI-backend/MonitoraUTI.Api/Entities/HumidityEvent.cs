using System.ComponentModel.DataAnnotations;

namespace MonitoraUTI.Api.Entities;

public class HumidityEvent
{
    [Key]
    public int Id { get; set; }
    public int BedId { get; set; }
    public Bed? Bed { get; set; }
    public DateTime DetectedAt { get; set; } = DateTime.UtcNow;
    public double HumidityValue { get; set; }
}
