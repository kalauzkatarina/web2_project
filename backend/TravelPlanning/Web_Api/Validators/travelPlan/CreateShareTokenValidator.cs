using Common.DTOs.travelPlan;
using FluentValidation;

namespace Web_Api.Validators.travelPlan
{
    public class CreateShareTokenValidator : AbstractValidator<CreateShareTokenDto>
    {
        public CreateShareTokenValidator()
        {
            RuleFor(x => x.PlanId)
                .NotEmpty().WithMessage("Plan ID is required.");

            RuleFor(x => x.AccessType)
                .IsInEnum().WithMessage("Invalid access type.");

            RuleFor(x => x.DaysValid)
                .GreaterThan(0).WithMessage("Days valid must be greater than 0.")
                .LessThanOrEqualTo(365).WithMessage("Share token cannot be valid for more than 365 days.")
                .When(x => x.DaysValid.HasValue); // validira samo ako nije null
        }
    }
}
