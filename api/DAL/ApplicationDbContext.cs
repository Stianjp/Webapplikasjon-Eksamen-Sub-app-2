namespace Sub_App_1.DAL;

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Sub_App_1.Models;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Product> Products { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Use Lazy Loading Proxies
        // optionsBuilder.UseLazyLoadingProxies();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure the relationship between Product and IdentityUser
        modelBuilder.Entity<Product>()
            .HasOne(p => p.Producer)
            .WithMany()
            .HasForeignKey(p => p.ProducerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}