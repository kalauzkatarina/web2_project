using Common.DTOs.finance;
using FluentValidation;

namespace Web_Api.Validators.finance
{
    public class AddExpenseValidator : AbstractValidator<AddExpenseDto>
    {
        public AddExpenseValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(100).WithMessage("Title cannot exceed 100 characters.");

            RuleFor(x => x.Amount)
                .GreaterThan(0).WithMessage("Amount must be greater than zero.");

            RuleFor(x => x.PlanId)
                .NotEmpty().WithMessage("Plan ID is required.");

            RuleFor(x => x.Category)
                .IsInEnum().WithMessage("Invalid expense category.");

            RuleFor(x => x.Date)
                .NotEmpty().WithMessage("Date is required.");
        }
    }
}
