using Common.DTOs.user;
using Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserService.Interfaces
{
    public interface IAccountService
    {
        Task<Result<bool>> CreateUser(RegisterDto dto);
        Task<Result<string>> Login(LoginDto dto);
        Task<Result<List<UserDto>>> GetAllUsers();
        Task<Result<bool>> DeleteUser(Guid userId);
        Task<Result<UserDto>> GetUserById (Guid id);
    }
}
