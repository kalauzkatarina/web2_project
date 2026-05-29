using FinanceService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinanceService.Context
{
    public class FinanceDbContext : DbContext
    {
        public FinanceDbContext(DbContextOptions<FinanceDbContext> options) : base(options) { }

        public DbSet<Expense> Expenses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Expense>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Amount).IsRequired();
                entity.Property(e => e.Category).HasConversion<string>();
                entity.Property(e => e.Description).HasMaxLength(500);
            });
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var configuration = new ConfigurationBuilder()
                                   .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                                   .AddJsonFile("local.settings.json", optional: false)
                                   .Build();

                string connectionString = configuration["Values:FinanceDbConnectionString"];

                if (!string.IsNullOrEmpty(connectionString))
                {
                    optionsBuilder.UseSqlServer(connectionString);
                }
            }
        }
    }
}
