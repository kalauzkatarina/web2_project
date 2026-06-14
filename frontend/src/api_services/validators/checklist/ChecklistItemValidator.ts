import type { ChecklistErrors } from "../../../types/checklist/ChecklistErrors";

export function validateChecklistItem(title: string): ChecklistErrors {
    const errors: ChecklistErrors = {};

    if (!title.trim())
        errors.title = "Title is required.";
    else if (title.length > 200)
        errors.title = "Title cannot exceed 200 characters.";

    return errors;
}