export type JwtTokenClaims = {
    sub     : string    // Backend koristi JwtRegisteredClaimNames.Sub
    email   : string;   // Backend koristi JwtRegisteredClaimNames.Email
    role    : string;   // Backend koristi ClaimTypes.Role
    exp     : number;   // Standardni claim
};