using Common.DTOs.travelPlan;
using FluentValidation;

namespace Web_Api.Validators.travelPlan
{
    public class UpdateDestinationValidator : AbstractValidator<UpdateDestionationDto>
    {
        public UpdateDestinationValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Destination name is required.")
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");

            RuleFor(x => x.Location)
                .NotEmpty().WithMessage("Location is required.")
                .MaximumLength(200).WithMessage("Location cannot exceed 200 characters.");

            RuleFor(x => x.ArrivalDate)
                .NotEmpty().WithMessage("Arrival date is required.");

            RuleFor(x => x.DepartureDate)
                .NotEmpty().WithMessage("Departure date is required.")
                .GreaterThanOrEqualTo(x => x.ArrivalDate)
                .WithMessage("Departure date cannot be before arrival date.");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");
        }
    }
}
