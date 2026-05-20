using MonitoraUTI.Api.Entities;

namespace MonitoraUTI.Api.Data;

public static class SeedData
{
    public static void Initialize(AppDbContext db)
    {
        if (db.Beds.Any()) return;

        var beds = new List<Bed>
        {
            new Bed { Name = "Cama 01", Room = "A1", PatientName = "João da Silva", AdmissionReason = "Cirurgia", CurrentHumidity = 12 },
            new Bed { Name = "Cama 02", Room = "A1", PatientName = "Maria Santos", AdmissionReason = "Observação", CurrentHumidity = 30 },
            new Bed { Name = "Cama 03", Room = "A2", PatientName = null, AdmissionReason = null, IsActive = false }
        };

        db.Beds.AddRange(beds);
        db.SaveChanges();
    }
}
