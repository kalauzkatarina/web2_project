using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelPlanService.Models;

namespace TravelPlanService.Context
{
    public class TravelDbContext : DbContext
    {
        public TravelDbContext(DbContextOptions<TravelDbContext> options) : base(options) { }

        public DbSet<TravelPlan> TravelPlans { get; set; }
        public DbSet<Destination> Destinations { get; set; }
        public DbSet<Activity> Activities { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TravelPlan>().HasKey(tp => tp.Id);

            modelBuilder.Entity<Destination>().HasKey(d => d.Id);
            modelBuilder.Entity<Destination>()
                .HasOne<TravelPlan>()
                .WithMany(tp => tp.Destinations)
                .HasForeignKey(d => d.TravelPlanId)
                .OnDelete(DeleteBehavior.Cascade); //ako se obrise plan, brisu se destinacije

            modelBuilder.Entity<Activity>().HasKey(a => a.Id);
            modelBuilder.Entity<Activity>()
                .Property(a => a.Status)
                .HasConversion<string>(); //cuva enum kao string u bazi

            modelBuilder.Entity<Activity>()
                .HasOne<Destination>()
                .WithMany(d => d.Activities)
                .HasForeignKey(a => a.DestinationId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var configuration = new ConfigurationBuilder()
                                   .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                                   .AddJsonFile("local.settings.json", optional: false)
                                   .Build();

                string connectionString = configuration["Values:TravelDbConnectionString"];

                if (!string.IsNullOrEmpty(connectionString))
                {
                    optionsBuilder.UseSqlServer(connectionString);
                }
            }
        }
    }
}
