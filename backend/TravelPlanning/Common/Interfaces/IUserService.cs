using Common.DTOs.user;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interfaces
{
    public interface IUserService : IService
    {
        Task<bool> Register(RegisterDto registerDto);
    }
}
