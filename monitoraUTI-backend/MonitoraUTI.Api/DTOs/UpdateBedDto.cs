namespace MonitoraUTI.Api.DTOs;

public record UpdateBedDto(string Name, string? Room, string? PatientName, string? AdmissionReason, bool IsActive);
