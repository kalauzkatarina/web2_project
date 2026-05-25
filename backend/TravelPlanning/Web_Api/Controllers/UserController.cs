using Common.DTOs.user;
using Common.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Remoting.Client;

namespace Web_Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
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

            if (result)
            {
                return Ok(new { Message = "User successfully registered!" });
            }

            return BadRequest(new { Message = "User with this email already exists." });
        }
    }
}
