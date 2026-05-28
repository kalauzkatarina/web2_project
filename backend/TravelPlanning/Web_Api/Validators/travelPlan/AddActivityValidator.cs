using Common.DTOs.travelPlan;
using FluentValidation;

namespace Web_Api.Validators.travelPlan
{
    public class AddActivityValidator : AbstractValidator<AddActivityDto>
    {
        public AddActivityValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Activity title is required.")
                .MaximumLength(100).WithMessage("Title cannot exceed 100 characters.");

            RuleFor(x => x.Location)
                .MaximumLength(200).WithMessage("Location cannot exceed 200 characters.");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");

            RuleFor(x => x.EstimatedCost)
                .GreaterThanOrEqualTo(0).WithMessage("Estimated cost cannot be negative.");

            RuleFor(x => x.Date)
                .NotEmpty().WithMessage("Date is required.");

            RuleFor(x => x.Time)
                .NotEmpty().WithMessage("Time is required.");

            RuleFor(x => x.DestinationId)
                .NotEmpty().WithMessage("Destination ID is required.");

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid activity status.");
        }
    }
}
