using Microsoft.AspNetCore.Mvc;
using MonitoraUTI.Api.Repositories;

namespace MonitoraUTI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IHumidityEventRepository _events;
    public EventsController(IHumidityEventRepository events) => _events = events;

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int take = 20)
    {
        var list = await _events.GetLatestAsync(take);
        return Ok(list.Select(e => new { e.Id, e.BedId, e.DetectedAt, e.HumidityValue, BedName = e.Bed?.Name }));
    }
}
