/**
 * Form Validation Utility
 * =======================
 * 
 * Validasi form fields dengan berbagai rules
 */

export type ValidationRule = {
    type: "required" | "email" | "phone" | "nik" | "minLength" | "maxLength" | "pattern" | "custom";
    value?: number | string | RegExp | ((value: string) => boolean);
    message: string;
};

/**
 * Validate single field
 */
export function validateField(value: string, rules: ValidationRule[]): string | null {
    for (const rule of rules) {
        switch (rule.type) {
            case "required":
                if (!value || value.trim() === "") {
                    return rule.message;
                }
                break;

            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    return rule.message;
                }
                break;

            case "phone":
                const phoneRegex = /^(\+62|62|0)[0-9]{8,12}$/;
                if (value && !phoneRegex.test(value.replace(/\s|-/g, ""))) {
                    return rule.message;
                }
                break;

            case "nik":
                const nikRegex = /^[0-9]{16}$/;
                if (value && !nikRegex.test(value)) {
                    return rule.message;
                }
                break;

            case "minLength":
                if (value && value.length < (rule.value as number)) {
                    return rule.message;
                }
                break;

            case "maxLength":
                if (value && value.length > (rule.value as number)) {
                    return rule.message;
                }
                break;

            case "pattern":
                if (value && !(rule.value as RegExp).test(value)) {
                    return rule.message;
                }
                break;

            case "custom":
                if (value && !(rule.value as (value: string) => boolean)(value)) {
                    return rule.message;
                }
                break;
        }
    }
    return null;
}

/**
 * Validate entire form
 */
export function validateForm<T extends Record<string, string>>(
    values: T,
    schema: Record<keyof T, ValidationRule[]>
): Record<keyof T, string | null> {
    const errors: Record<string, string | null> = {};

    for (const field in schema) {
        errors[field] = validateField(values[field], schema[field]);
    }

    return errors as Record<keyof T, string | null>;
}

/**
 * Check if form has errors
 */
export function hasErrors<T>(errors: Record<keyof T, string | null>): boolean {
    return Object.values(errors).some((error) => error !== null);
}

/**
 * Common validation rules
 */
export const VALIDATION_RULES = {
    required: (message = "Field ini wajib diisi"): ValidationRule => ({
        type: "required",
        message,
    }),

    email: (message = "Email tidak valid"): ValidationRule => ({
        type: "email",
        message,
    }),

    phone: (message = "Nomor HP tidak valid (format: 08xxx)"): ValidationRule => ({
        type: "phone",
        message,
    }),

    nik: (message = "NIK harus 16 digit angka"): ValidationRule => ({
        type: "nik",
        message,
    }),

    minLength: (min: number, message?: string): ValidationRule => ({
        type: "minLength",
        value: min,
        message: message || `Minimal ${min} karakter`,
    }),

    maxLength: (max: number, message?: string): ValidationRule => ({
        type: "maxLength",
        value: max,
        message: message || `Maksimal ${max} karakter`,
    }),

    pattern: (regex: RegExp, message: string): ValidationRule => ({
        type: "pattern",
        value: regex,
        message,
    }),

    custom: (fn: (value: string) => boolean, message: string): ValidationRule => ({
        type: "custom",
        value: fn,
        message,
    }),
};
