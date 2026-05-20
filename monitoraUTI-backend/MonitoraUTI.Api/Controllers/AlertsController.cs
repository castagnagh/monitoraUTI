using Microsoft.AspNetCore.Mvc;
using MonitoraUTI.Api.DTOs;
using MonitoraUTI.Api.Services;

namespace MonitoraUTI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlertsController : ControllerBase
{
    private readonly IAlertService _alerts;
    public AlertsController(IAlertService alerts) => _alerts = alerts;

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] AlertDto dto)
    {
        await _alerts.ReceiveAlertAsync(dto);
        return Accepted();
    }
}
