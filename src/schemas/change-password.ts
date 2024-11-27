import { z } from 'zod';

export const changePasswordFormErrorMessages = (dictionary: { [key: string]: string } | null) => ({
  en: {
    requiredCurrentPassword:
      dictionary?.current_password_required_error || 'Current password is required.',
    requiredPassword: dictionary?.password_required_error || 'New Password is required.',
    requiredConfirm: dictionary?.password_confirm_required_error || 'Confirm password is required.',
    passwordMismatch: dictionary?.passwords_mismatch_error || "Passwords don't match."
  },
  es: {
    requiredCurrentPassword: dictionary?.password_required_error || 'Contraseña actual requerida.',
    requiredPassword: dictionary?.password_required_error || 'Contraseña requerida.',
    requiredConfirm:
      dictionary?.password_confirm_required_error || 'Confirmar contraseña requerido.',
    passwordMismatch: dictionary?.passwords_mismatch_error || 'Las contraseñas no coinciden.'
  }
});

export const createChangePasswordFormErrorMap = (
  errorMessages: Record<string, Record<string, string>>
) => {
  return (locale: string): z.ZodErrorMap =>
    (issue, ctx) => {
      const messages = errorMessages[locale] || errorMessages['en']; // fallback to English

      if (issue.code === z.ZodIssueCode.too_small) {
        if (issue.path[0] === 'currentPassword') {
          return { message: messages.requiredCurrentPassword || ctx.defaultError };
        }

        if (issue.path[0] === 'password') {
          return { message: messages.requiredPassword || ctx.defaultError };
        }

        if (issue.path[0] === 'passwordConfirmation') {
          return { message: messages.requiredConfirm || ctx.defaultError };
        }
      }

      if (issue.code === z.ZodIssueCode.custom) {
        if (issue.path[0] === 'passwordConfirmation') {
          return { message: messages.passwordMismatch || ctx.defaultError };
        }
      }

      return { message: ctx.defaultError };
    };
};

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().trim().min(1),
    password: z.string().trim().min(1),
    passwordConfirmation: z.string().trim().min(1)
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'] // path of error
  });
