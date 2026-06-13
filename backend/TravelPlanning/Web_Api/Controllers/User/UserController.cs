using Common.DTOs.user;
using Common.Enums;
using Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using System.Security.Claims;

namespace Web_Api.Controllers.User
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController()
        {
            _userService = ServiceProxy.Create<IUserService>(new Uri("fabric:/TravelPlanning/UserService"));
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (registerDto == null) return BadRequest(new { Message = "Request data is empty." });

            var result = await _userService.Register(registerDto);

            if (result.IsSuccess)
            {
                return Ok(new { Message = "User successfully registered!" });
            }

            return BadRequest(new { Message = result.ErrorMessage });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (loginDto == null) return BadRequest(new { Message = "Login data is empty." });

            var result = await _userService.Login(loginDto);

            if (result.IsSuccess)
            {
                return Ok(new { Token = result.Data, Message = "Login successful!" });
            }

            return Unauthorized(new {Message = result.ErrorMessage});
        }

        [HttpGet("all")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var result = await _userService.GetAllUsers();

            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }

            return BadRequest(new { Message = result.ErrorMessage });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            if(!Guid.TryParse(id, out Guid userId))
            {
                return BadRequest(new { Message = "The provided ID format is not valid. It must be a Guid." });
            }
            var result = await _userService.DeleteUser(userId);

            if(result.IsSuccess)
            {
                return Ok(new { Message = $"User with ID {id} has been successfully deleted." });
            }

            return NotFound(new { Message = result.ErrorMessage });
        }

        [HttpGet("{id}")]
        [Authorize] //samo ulogovani vide profile
        public async Task<IActionResult> GetUserById(string id)
        {
            if (!Guid.TryParse(id, out Guid userId))
            {
                return BadRequest(new { Message = "The provided ID format is not valid. It must be a Guid." });
            }
            var result = await _userService.GetUserById(userId);

            if(result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return NotFound(new { Message = result.ErrorMessage });
        }
        //patch jer menjamo samo deo resursa
        [HttpPatch("{id}/role")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRole(string id, [FromBody] UpdateUserRoleDto dto)
        {
            var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (adminIdClaim == null)
                return Unauthorized();

            Guid adminId = Guid.Parse(adminIdClaim);

            if (!Guid.TryParse(id, out Guid targetUserId))
                return BadRequest("Invalid ID format.");

            var result = await _userService.UpdateUserRole(
                adminId,
                targetUserId,
                dto.NewRole);

            if (result.IsSuccess)
                return Ok();

            return BadRequest(result.ErrorMessage);
        }
    }
}
