using Common.DTOs.user;
using FluentValidation;

namespace Web_Api.Validators.user
{
    public class UserLoginContractValidator : AbstractValidator<LoginDto>
    {
        public UserLoginContractValidator()
        {
            RuleFor(user => user.Email)
                .NotEmpty().WithMessage("Email address is required.")
                .EmailAddress().WithMessage("Please provide a valid email format.");

            RuleFor(user => user.Password)
                .NotEmpty().WithMessage("Password is required.");
        }
    }
}
