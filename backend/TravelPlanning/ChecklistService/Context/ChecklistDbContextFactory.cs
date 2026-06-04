using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChecklistService.Context
{
    public class ChecklistDbContextFactory : IDesignTimeDbContextFactory<ChecklistDbContext>
    {
        public ChecklistDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                           .SetBasePath(Directory.GetCurrentDirectory())
                           .AddJsonFile("local.settings.json", optional: false)
                           .Build();

            var optionsBuilder = new DbContextOptionsBuilder<ChecklistDbContext>();

            var connectionString = configuration["Values:ChecklistDbConnectionString"];

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("Not found 'ChecklistDbConnectionString' in local.settings.json!");
            }

            optionsBuilder.UseSqlServer(connectionString);

            return new ChecklistDbContext(optionsBuilder.Options);
        }
    }
}
