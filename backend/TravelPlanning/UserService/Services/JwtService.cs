using Common.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Fabric;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace UserService.Services
{
    public class JwtService : IJwtService
    {
        private readonly StatelessServiceContext _context;

        public JwtService(StatelessServiceContext context)
        {
            _context = context;
        }
        public string CreateToken(Guid userId, string email, string role)
        {
            var config = _context.CodePackageActivationContext.GetConfigurationPackageObject("Config");
            var jwtSection = config.Settings.Sections["JwtConfig"];

            var key = jwtSection.Parameters["Key"].Value;
            var issuer = jwtSection.Parameters["Issuer"].Value;
            var audience = jwtSection.Parameters["Audience"].Value;
            var expiration = int.Parse(jwtSection.Parameters["ExpirationMinutes"].Value);

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim("role", role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiration),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
