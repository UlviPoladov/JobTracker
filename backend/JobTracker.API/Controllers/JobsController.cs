using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JobTracker.API.DTOs;
using JobTracker.API.Models;
using JobTracker.API.Repositories;

namespace JobTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class JobsController : ControllerBase
{
    private readonly IJobRepository _repo;

    public JobsController(IJobRepository repo) => _repo = repo;

    private Guid UserId => Guid.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var jobs = await _repo.GetAllByUserAsync(UserId);
        return Ok(jobs.Select(MapToResponse));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var job = await _repo.GetByIdAsync(id, UserId);
        return job is null ? NotFound() : Ok(MapToResponse(job));
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _repo.GetStatsAsync(UserId);
        return Ok(stats);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateJobRequest request)
    {
        if (!Enum.TryParse<JobStatus>(request.Status, out var status))
            status = JobStatus.Applied;

        var job = new Job
        {
            UserId = UserId,
            CompanyName = request.CompanyName,
            Position = request.Position,
            Location = request.Location,
            JobUrl = request.JobUrl,
            Notes = request.Notes,
            Status = status
        };

        var created = await _repo.CreateAsync(job);
        return CreatedAtAction(nameof(GetById),
            new { id = created.Id }, MapToResponse(created));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateJobRequest request)
    {
        var job = await _repo.GetByIdAsync(id, UserId);
        if (job is null) return NotFound();

        if (request.CompanyName is not null) job.CompanyName = request.CompanyName;
        if (request.Position is not null) job.Position = request.Position;
        if (request.Location is not null) job.Location = request.Location;
        if (request.JobUrl is not null) job.JobUrl = request.JobUrl;
        if (request.Notes is not null) job.Notes = request.Notes;
        if (request.Status is not null && Enum.TryParse<JobStatus>(request.Status, out var status))
            job.Status = status;

        var updated = await _repo.UpdateAsync(job);
        return Ok(MapToResponse(updated));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _repo.DeleteAsync(id, UserId);
        return deleted ? NoContent() : NotFound();
    }

    private static JobResponse MapToResponse(Job j) => new(
        j.Id, j.CompanyName, j.Position,
        j.Location, j.JobUrl, j.Notes,
        j.Status.ToString(), j.AppliedAt, j.UpdatedAt);
}