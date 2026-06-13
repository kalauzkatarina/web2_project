using Common.DTOs.mailing;
using Common.DTOs.travelPlan;
using Common.Interfaces;
using Common.Models;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelPlanService.Interfaces;
using TravelPlanService.Mappers;
using TravelPlanService.Models;

namespace TravelPlanService.Services
{
    public class ShareTokenService : IShareTokenService
    {
        private readonly IShareTokenRepository _shareTokenRepository;
        private readonly IPlanRepository _travelPlanRepository;

        public ShareTokenService(IShareTokenRepository shareTokenRepository, IPlanRepository travelPlanRepository)
        {
            _shareTokenRepository = shareTokenRepository;
            _travelPlanRepository = travelPlanRepository;
        }

        public async Task<Result<ShareTokenDto>> CreateAndSendAsync(Guid userId, CreateShareTokenDto dto, string toEmail)
        {
            var tokenResult = await CreateAsync(userId, dto);
            if (!tokenResult.IsSuccess)
                return tokenResult;

            if (!string.IsNullOrEmpty(toEmail))
            {
                try
                {
                    var mailingProxy = ServiceProxy.Create<IMailingService>(
                        new Uri("fabric:/TravelPlanning/MailingService"));

                    var plan = await _travelPlanRepository.GetByIdAsync(dto.PlanId);

                    await mailingProxy.SendShareEmailAsync(new SendShareEmailDto
                    {
                        ToEmail = toEmail,
                        PlanTitle = plan?.Title ?? "Travel plan",
                        ShareUrl = tokenResult.Data.ShareUrl,
                        AccessType = dto.AccessType,
                        ExpiresAt = tokenResult.Data.ExpiresAt
                    });
                } 
                catch (Exception ex)
                {

                }
            }

            return tokenResult;
        }

        public async Task<Result<ShareTokenDto>> CreateAsync(Guid userId, CreateShareTokenDto dto)
        {
            var plan = await _travelPlanRepository.GetByIdAsync(dto.PlanId);
            if (plan == null)
                return Result<ShareTokenDto>.Failure("Travel plan not found.");

            if (plan == null || plan.UserId != userId)
                return Result<ShareTokenDto>.Failure("You can only share your own travel plans.");

            var shareToken = new ShareToken
            {
                Id = Guid.NewGuid(),
                PlanId = dto.PlanId,
                Token = Guid.NewGuid().ToString("N"), //random token bez crtica
                AccessType = dto.AccessType,
                CreatedAt = DateTime.Now,
                ExpiresAt = dto.DaysValid.HasValue
                    ? DateTime.Now.AddDays(dto.DaysValid.Value) : null
            };

            var created = await _shareTokenRepository.CreateAsync(shareToken);

            return Result<ShareTokenDto>.Success(ShareTokenMapper.ToDto(created));
        }

        public async Task<Result<SharedTravelPlanDto>> GetPlanByTokenAsync(string token)
        {
            var shareToken = await _shareTokenRepository.GetByTokenAsync(token);
            if (shareToken == null)
                return Result<SharedTravelPlanDto>.Failure("Invalid or expired token.");

            if (shareToken.ExpiresAt.HasValue && shareToken.ExpiresAt < DateTime.Now)
                return Result<SharedTravelPlanDto>.Failure("Share token has expired.");

            var plan = await _travelPlanRepository.GetByIdAsync(shareToken.PlanId);
            if (plan == null)
                return Result<SharedTravelPlanDto>.Failure("Travel plan not found.");

            return Result<SharedTravelPlanDto>.Success(
                   new SharedTravelPlanDto
                   {
                       Plan = TravelPlanMapper.ToDto(plan),
                       AccessType = shareToken.AccessType
                   });
        }
    }
}
