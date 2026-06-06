using Common.DTOs.checklist;
using FluentValidation;

namespace Web_Api.Validators.checklist
{
    public class AddChecklistItemValidator : AbstractValidator<AddChecklistItemDto>
    {
        public AddChecklistItemValidator()
        {

            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required.");
            RuleFor(x => x.Title).MaximumLength(200).WithMessage("Title cannot exceed 200 characters.");
            RuleFor(x => x.PlanId).NotEmpty().WithMessage("Plan ID is required.");
        }
    }
}
