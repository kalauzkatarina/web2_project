using Common.DTOs.user;
using Common.Models;
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
        Task<Result<bool>> Register(RegisterDto registerDto);
        Task<Result<string>> Login(LoginDto loginDto);
        Task<Result<List<UserDto>>> GetAllUsers();
        Task<Result<bool>> DeleteUser(Guid userId);
        Task<Result<UserDto>> GetUserById(Guid userId);
    }
}
