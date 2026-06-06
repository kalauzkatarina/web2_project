using Common.DTOs.checklist;
using FluentValidation;

namespace Web_Api.Validators.checklist
{
    public class UpdateChecklistItemValidator : AbstractValidator<UpdateChecklistItemDto>
    {
        public UpdateChecklistItemValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required.");
            RuleFor(x => x.Title).MaximumLength(200).WithMessage("Title cannot exceed 200 characters.");
            RuleFor(x => x.IsCompleted).NotNull().WithMessage("Completion status is required.");
        }
    }
}
