using Common.DTOs.travelPlan;
using Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPlanService.Interfaces
{
    public interface IDestinationService
    {
        Task<Result<DestinationDto>> AddAsync(Guid userId, AddDestinationDto dto);
        Task<Result<List<DestinationDto>>> GetByPlanAsync(Guid planId, Guid userId);
        Task<Result<DestinationDto>> GetByIdAsync(Guid destinationId, Guid userId);
        Task<Result<bool>> UpdateAsync(Guid destinationId, Guid userId, UpdateDestionationDto dto);
        Task<Result<bool>> DeleteAsync(Guid destinationId, Guid userId);
    }
}
