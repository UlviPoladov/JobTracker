namespace JobTracker.API.Models;

public enum JobStatus
{
    Applied,
    Interview,
    TechnicalTest,
    Offer,
    Rejected,
    Ghosted
}

public class Job
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? JobUrl { get; set; }
    public string? Notes { get; set; }
    public JobStatus Status { get; set; } = JobStatus.Applied;
    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}