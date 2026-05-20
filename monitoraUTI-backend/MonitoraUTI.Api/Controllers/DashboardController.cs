using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MonitoraUTI.Api.Data;

namespace MonitoraUTI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _db;
    public DashboardController(AppDbContext db) => _db = db;

    [HttpGet]
    public IActionResult Get()
    {
        var totalBeds = _db.Beds.Count();
        var activeBeds = _db.Beds.Count(b => b.IsActive);
        var alertBeds = _db.Beds.Count(b => b.HasHumidityAlert);
        var monitoredPatients = _db.Beds.Count(b => b.PatientName != null && b.PatientName != string.Empty);

        var latestAlerts = _db.HumidityEvents
            .OrderByDescending(e => e.DetectedAt)
            .Take(10)
            .Select(e => new
            {
                e.Id,
                e.BedId,
                BedName = e.Bed != null ? e.Bed.Name : null,
                e.DetectedAt,
                e.HumidityValue
            })
            .ToList();

        var recentEvents = _db.HumidityEvents
            .OrderByDescending(e => e.DetectedAt)
            .Take(10)
            .Select(e => new
            {
                e.Id,
                e.BedId,
                BedName = e.Bed != null ? e.Bed.Name : null,
                e.DetectedAt,
                e.HumidityValue
            })
            .ToList();

        return Ok(new
        {
            totalBeds,
            activeBeds,
            alertBeds,
            monitoredPatients,
            latestAlerts,
            recentEvents
        });
    }
}
