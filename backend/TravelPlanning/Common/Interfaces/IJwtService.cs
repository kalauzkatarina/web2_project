using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interfaces
{
    public interface IJwtService
    {
        string CreateToken(Guid userId, string email, string role);
    }
}
