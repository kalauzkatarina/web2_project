using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.Extensions.DependencyInjection;
using UserService.Context;
using Microsoft.EntityFrameworkCore;
using UserService.Interfaces;
using UserService.Repositories;
using UserService.Services;
using Common.Interfaces;
using Common.DTOs.user;
using Common.Models;

namespace UserService
{
    /// <summary>
    /// An instance of this class is created for each service instance by the Service Fabric runtime.
    /// </summary>
    internal sealed class UserService : StatelessService, IUserService
    {
        private readonly ServiceProvider _serviceProvider;
        public UserService(StatelessServiceContext context)
            : base(context)
        {
            var config = context.CodePackageActivationContext.GetConfigurationPackageObject("Config").Settings;
            var sqlConn = config.Sections["DbConfig"].Parameters["UserDbConnectionString"].Value;

            var services = new ServiceCollection();

            services.AddDbContext<UserDbContext>(options => options.UseSqlServer(sqlConn));
            services.AddSingleton<StatelessServiceContext>(context);
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IPasswordService,  PasswordService>();
            services.AddScoped<IJwtService,  JwtService>();

            _serviceProvider = services.BuildServiceProvider();
        }

        public async Task<Result<string>> Login(LoginDto loginDto)
        {
            using(var scope = _serviceProvider.CreateScope())
            {
                var accountService = scope.ServiceProvider.GetRequiredService<IAccountService>();
                return await accountService.Login(loginDto);
            }
        }

        public async Task<Result<bool>> Register(RegisterDto registerDto)
        {
            using(var scope = _serviceProvider.CreateScope())
            {
                var accountService = scope.ServiceProvider.GetRequiredService<IAccountService>();
                return await accountService.CreateUser(registerDto);
            }
        }

        /// <summary>
        /// Optional override to create listeners (e.g., TCP, HTTP) for this service replica to handle client or user requests.
        /// </summary>
        /// <returns>A collection of listeners.</returns>
        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return this.CreateServiceRemotingInstanceListeners();
        }

        /// <summary>
        /// This is the main entry point for your service instance.
        /// </summary>
        /// <param name="cancellationToken">Canceled when Service Fabric needs to shut down this service instance.</param>
        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            // TODO: Replace the following sample code with your own logic 
            //       or remove this RunAsync override if it's not needed in your service.

            long iterations = 0;

            while (true)
            {
                cancellationToken.ThrowIfCancellationRequested();

                ServiceEventSource.Current.ServiceMessage(this.Context, "Working-{0}", ++iterations);

                await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
            }
        }
    }
}
