using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinanceService.Context
{
    public class FinanceDbContextFactory : IDesignTimeDbContextFactory<FinanceDbContext>
    {
        public FinanceDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                           .SetBasePath(Directory.GetCurrentDirectory())
                           .AddJsonFile("local.settings.json", optional: false)
                           .Build();

            var optionsBuilder = new DbContextOptionsBuilder<FinanceDbContext>();

            var connectionString = configuration["Values:FinanceDbConnectionString"];

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("Not found 'FinanceDbConnectionString' in local.settings.json!");
            }

            optionsBuilder.UseSqlServer(connectionString);

            return new FinanceDbContext(optionsBuilder.Options);
        }
    }
}
