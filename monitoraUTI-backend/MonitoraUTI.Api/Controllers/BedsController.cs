using Microsoft.AspNetCore.Mvc;
using MonitoraUTI.Api.DTOs;
using MonitoraUTI.Api.Services;

namespace MonitoraUTI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BedsController : ControllerBase
{
    private readonly IBedService _beds;
    public BedsController(IBedService beds) => _beds = beds;

    [HttpGet]
    public async Task<IActionResult> Get() => Ok(await _beds.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id) => Ok(await _beds.GetByIdAsync(id));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBedDto dto)
    {
        var created = await _beds.CreateAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPost("bulk")]
    public async Task<IActionResult> CreateBulk([FromBody] CreateBedDto[] dtos)
    {
        var list = new List<object>();
        foreach (var dto in dtos)
        {
            var c = await _beds.CreateAsync(dto);
            list.Add(c);
        }
        return Ok(list);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateBedDto dto)
    {
        await _beds.UpdateAsync(id, dto);
        return NoContent();
    }

    [HttpPost("{id}/toggle")]
    public async Task<IActionResult> Toggle(int id)
    {
        await _beds.ToggleActiveAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/clear-alert")]
    public async Task<IActionResult> ClearAlert(int id)
    {
        await _beds.ClearAlertAsync(id);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _beds.DeleteAsync(id);
        return NoContent();
    }
}
