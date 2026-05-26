using Common.DTOs.user;
using FluentValidation;

namespace Web_Api.Validators
{
    public class UserRegisterContractValidator : AbstractValidator<RegisterDto>
    {
        public UserRegisterContractValidator()
        {
            RuleFor(user => user.FirstName)
                .NotEmpty().WithMessage("First name is mandatory.")
                .MinimumLength(2).WithMessage("First name must be at least 2 characters.")
                .MaximumLength(50).WithMessage("First name cannot exceed 50 characters.");

            RuleFor(user => user.LastName)
                .NotEmpty().WithMessage("Last name is mandatory.")
                .MinimumLength(2).WithMessage("Last name must be at least 2 characters.")
                .MaximumLength(50).WithMessage("Last name cannot exceed 50 characters.");

            RuleFor(user => user.Email)
                .NotEmpty().WithMessage("Email address is required.")
                .EmailAddress().WithMessage("Please provide a valid email format.");

            RuleFor(user => user.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(3).WithMessage("Password must be at least 3 characters.")
                .MaximumLength(8).WithMessage("Password must be max 8 characters.");
        }
    }
}
