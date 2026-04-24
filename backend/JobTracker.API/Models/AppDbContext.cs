using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace JobTracker.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Job> Jobs => Set<Job>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Email).HasMaxLength(200);
            e.Property(u => u.FullName).HasMaxLength(100);
        });

        modelBuilder.Entity<Job>(e =>
        {
            e.HasKey(j => j.Id);
            e.Property(j => j.CompanyName).HasMaxLength(200);
            e.Property(j => j.Position).HasMaxLength(200);
            e.Property(j => j.Status).HasConversion<string>();
            e.HasOne(j => j.User)
             .WithMany(u => u.Jobs)
             .HasForeignKey(j => j.UserId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}