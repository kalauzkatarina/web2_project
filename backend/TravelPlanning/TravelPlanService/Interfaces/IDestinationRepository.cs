using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelPlanService.Models;

namespace TravelPlanService.Interfaces
{
    public interface IDestinationRepository
    {
        Task<Destination> AddAsync(Destination destination);
        Task<List<Destination>?> GetByPlanIdAsync(Guid planId);
        Task<Destination?> GetByIdAsync(Guid destinationId);
        Task<bool> UpdateAsync(Destination destination);
        Task<bool> DeleteAsync(Guid destinationId);
    }
}
