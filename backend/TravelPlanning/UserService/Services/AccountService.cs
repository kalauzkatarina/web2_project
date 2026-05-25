using Common.DTOs.user;
using Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserService.Interfaces;
using UserService.Models;

namespace UserService.Services
{
    public class AccountService : IAccountService
    {
        private readonly IUserRepository _userRepository;

        public AccountService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<bool> CreateUser(RegisterDto dto)
        {
            var existing = await _userRepository.GetByEmailAsync(dto.Email);
            if (existing != null) return false;

            var newUser = new User(
                Guid.NewGuid(),
                dto.FirstName,
                dto.LastName,
                dto.Email,
                dto.Password, //ovo treba hesirati
                Enum.Parse<UserRole>(dto.Role));

            await _userRepository.AddAsync(newUser);
            return true;
        }
    }
}
