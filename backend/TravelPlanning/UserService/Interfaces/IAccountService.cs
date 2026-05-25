using Common.DTOs.user;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserService.Interfaces
{
    public interface IAccountService
    {
        Task<bool> CreateUser(RegisterDto dto);
    }
}
