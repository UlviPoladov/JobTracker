// Repositories/IJobRepository.cs
using JobTracker.API.Models;

namespace JobTracker.API.Repositories;

public interface IJobRepository
{
    Task<List<Job>> GetAllByUserAsync(Guid userId);
    Task<Job?> GetByIdAsync(Guid id, Guid userId);
    Task<Job> CreateAsync(Job job);
    Task<Job> UpdateAsync(Job job);
    Task<bool> DeleteAsync(Guid id, Guid userId);
    Task<Dictionary<string, int>> GetStatsAsync(Guid userId);
}