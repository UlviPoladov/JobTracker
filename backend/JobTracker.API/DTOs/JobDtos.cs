using System.ComponentModel.DataAnnotations;
using JobTracker.API.Models;

namespace JobTracker.API.DTOs;

public record CreateJobRequest(
    [Required] string CompanyName,
    [Required] string Position,
    string? Location,
    string? JobUrl,
    string? Notes,
    string Status = "Applied"
);

public record UpdateJobRequest(
    string? CompanyName,
    string? Position,
    string? Location,
    string? JobUrl,
    string? Notes,
    string? Status
);

public record JobResponse(
    Guid Id,
    string CompanyName,
    string Position,
    string? Location,
    string? JobUrl,
    string? Notes,
    string Status,
    DateTime AppliedAt,
    DateTime UpdatedAt
);