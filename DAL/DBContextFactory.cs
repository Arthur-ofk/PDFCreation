using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL
{
    public class DBContextFactory :IDesignTimeDbContextFactory<DataBaseContext>

    {
        public DataBaseContext CreateDbContext(string[] args)
        {
           
            var conn = Environment.GetEnvironmentVariable("ConnectionStrings__Default");
            var options = new DbContextOptionsBuilder<DataBaseContext>()
                .UseSqlServer(conn)
                .Options;

            return new DataBaseContext(options);
        }
    }
}
