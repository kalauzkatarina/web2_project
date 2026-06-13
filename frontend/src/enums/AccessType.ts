export const AccessType = {
    View: 0,
    Edit: 1,
} as const;

export type AccessType = typeof AccessType[keyof typeof AccessType];