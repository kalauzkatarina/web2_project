export function getActivityStatus(status: number): string {
    switch (status) {
        case 0:
            return "Planned";
        case 1:
            return "Reserved";
        case 2:
            return "Completed";
        case 3:
            return "Cancelled";
        default:
            return "Unknown";
    }
}

export function getExpenseCategory(category: number): string {
    switch (category) {
        case 0:
            return "Transport";
        case 1:
            return "Accommodation";
        case 2:
            return "Food";
        case 3:
            return "Tickets";
        case 4:
            return "Shopping";
        case 5:
            return "Other";
        default:
            return "Unknown";
    }
}