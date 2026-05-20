namespace MonitoraUTI.Api.DTOs;

public record CreateBedDto(string Name, string? Room, string? PatientName, string? AdmissionReason);
