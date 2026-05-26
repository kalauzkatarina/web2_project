using Common.DTOs.user;
using Common.Enums;
using Common.Interfaces;
using Common.Models;
using System;
using System.Collections.Generic;
using System.Fabric;
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
        private readonly IPasswordService _passwordService;
        private readonly IJwtService _jwtService;

        public AccountService(IUserRepository userRepository, IPasswordService passwordService, IJwtService jwtService)
        {
            _userRepository = userRepository;
            _passwordService = passwordService;
            _jwtService = jwtService;
        }

        public async Task<Result<bool>> CreateUser(RegisterDto dto)
        {
            var existing = await _userRepository.GetByEmailAsync(dto.Email);
            if (existing != null)
            {
                return Result<bool>.Failure("User with this email already exists.");
            }

            string hashedPassword = _passwordService.HashPassword(dto.Password);

            var newUser = new User(
                Guid.NewGuid(),
                dto.FirstName,
                dto.LastName,
                dto.Email,
                hashedPassword, 
                UserRole.User);

            await _userRepository.AddAsync(newUser);
            return Result<bool>.Success(true);
        }

        public async Task<Result<bool>> DeleteUser(Guid userId)
        {
            var success = await _userRepository.DeleteAsync(userId);
            if (!success)
            {
                return Result<bool>.Failure("User not found or could not be deleted.");
            }
            return Result<bool>.Success(true);
        }

        public async Task<Result<List<UserDto>>> GetAllUsers()
        {
            var users = await _userRepository.GetAllAsync();

            var userDtos = users.Select(u => new UserDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Role = u.Role.ToString(),
            }).ToList();

            return Result<List<UserDto>>.Success(userDtos);
        }

        public async Task<Result<UserDto>> GetUserById(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null) return Result<UserDto>.Failure("User not found.");

            var dto = new UserDto
            {
                Id = user.Id,
                FirstName= user.FirstName,
                LastName= user.LastName,
                Email = user.Email,
                Role = user.Role.ToString(),
            };

            return Result<UserDto>.Success(dto);
        }

        public async Task<Result<string>> Login(LoginDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);

            if(user == null)
            {
                return Result<string>.Failure("Invalid email or password.");
            }

            if(!_passwordService.VerifyPassword(dto.Password, user.Password))
            {
                return Result<string>.Failure("Invalid password.");
            }

            var token = _jwtService.CreateToken(user.Id, user.Email, user.Role.ToString());
            return Result<string>.Success(token);
        }
    }
}
