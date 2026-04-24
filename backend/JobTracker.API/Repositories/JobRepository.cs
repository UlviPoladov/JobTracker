// Repositories/JobRepository.cs
using Microsoft.EntityFrameworkCore;
using JobTracker.API.Data;
using JobTracker.API.Models;

namespace JobTracker.API.Repositories;

public class JobRepository : IJobRepository
{
    private readonly AppDbContext _db;

    public JobRepository(AppDbContext db) => _db = db;

    public async Task<List<Job>> GetAllByUserAsync(Guid userId) =>
        await _db.Jobs
            .Where(j => j.UserId == userId)
            .OrderByDescending(j => j.UpdatedAt)
            .ToListAsync();

    public async Task<Job?> GetByIdAsync(Guid id, Guid userId) =>
        await _db.Jobs.FirstOrDefaultAsync(j => j.Id == id && j.UserId == userId);

    public async Task<Job> CreateAsync(Job job)
    {
        _db.Jobs.Add(job);
        await _db.SaveChangesAsync();
        return job;
    }

    public async Task<Job> UpdateAsync(Job job)
    {
        job.UpdatedAt = DateTime.UtcNow;
        _db.Jobs.Update(job);
        await _db.SaveChangesAsync();
        return job;
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var job = await GetByIdAsync(id, userId);
        if (job is null) return false;
        _db.Jobs.Remove(job);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<Dictionary<string, int>> GetStatsAsync(Guid userId)
    {
        return await _db.Jobs
            .Where(j => j.UserId == userId)
            .GroupBy(j => j.Status)
            .ToDictionaryAsync(g => g.Key.ToString(), g => g.Count());
    }
}