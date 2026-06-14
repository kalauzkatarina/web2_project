import type { LoginErrors, RegisterErrors } from "../../../types/auth/AuthErrors";

export function validateLogin(email: string, password: string): LoginErrors {
    const errors: LoginErrors = {};

    if (!email.trim())
        errors.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errors.email = "Please provide a valid email format.";

    if (!password)
        errors.password = "Password is required.";

    return errors;
}

export function validateRegister(
    firstName: string,
    lastName: string,
    email: string,
    password: string
): RegisterErrors {
    const errors: RegisterErrors = {};

    if (!firstName.trim())
        errors.firstName = "First name is required.";
    else if (firstName.trim().length < 2)
        errors.firstName = "First name must be at least 2 characters.";
    else if (firstName.length > 50)
        errors.firstName = "First name cannot exceed 50 characters.";

    if (!lastName.trim())
        errors.lastName = "Last name is required.";
    else if (lastName.trim().length < 2)
        errors.lastName = "Last name must be at least 2 characters.";
    else if (lastName.length > 50)
        errors.lastName = "Last name cannot exceed 50 characters.";

    if (!email.trim())
        errors.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errors.email = "Please provide a valid email format.";

    if (!password)
        errors.password = "Password is required.";
    else if (password.length < 3)
        errors.password = "Password must be at least 3 characters.";
    else if (password.length > 8)
        errors.password = "Password cannot exceed 8 characters.";

    return errors;
}