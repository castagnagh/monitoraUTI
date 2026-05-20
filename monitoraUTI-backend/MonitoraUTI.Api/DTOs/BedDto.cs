namespace MonitoraUTI.Api.DTOs;

public record BedDto(int Id, string Name, string? Room, string? PatientName, string? AdmissionReason, bool IsActive, bool HasHumidityAlert, double? CurrentHumidity, string HumidityStatus, DateTime? LastAlertAt, DateTime CreatedAt);
