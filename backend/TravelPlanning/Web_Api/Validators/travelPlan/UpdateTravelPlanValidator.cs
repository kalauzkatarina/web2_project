using Common.DTOs.travelPlan;
using FluentValidation;

namespace Web_Api.Validators.travelPlan
{
    public class UpdateTravelPlanValidator : AbstractValidator<UpdateTravelPlanDto>
    {
        public UpdateTravelPlanValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(100).WithMessage("Title cannot exceed 100 characters.");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");

            RuleFor(x => x.StartDate)
                .NotEmpty().WithMessage("Start date is required.");

            RuleFor(x => x.EndDate)
                .NotEmpty().WithMessage("End date is required.")
                .GreaterThanOrEqualTo(x => x.StartDate)
                .WithMessage("End date cannot be before start date.");

            RuleFor(x => x.PlannedBudget)
                .GreaterThanOrEqualTo(0).WithMessage("Budget cannot be negative.");
        }
    }
}
