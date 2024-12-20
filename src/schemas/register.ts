import { z } from 'zod';

export const registerFormErrorMessages = (dictionary: { [key: string]: string } | null) => ({
  en: {
    requiredEmail: dictionary?.email_required_error || 'Email is required.',
    invalidEmail: dictionary?.email_invalid_error || 'Invalid email address.',
    requiredUsername: dictionary?.username_required_error || 'Username is required.',
    maxLengthUsername:
      dictionary?.username_maxlength_error || 'Username must be less than 50 characters.',
    requiredPassword: dictionary?.password_required_error || 'Password is required.',
    requiredConfirm: dictionary?.password_confirm_required_error || 'Confirm password is required.',
    passwordMismatch: dictionary?.passwords_mismatch_error || "Passwords don't match"
  },
  es: {
    requiredEmail: dictionary?.identifier_required_error || 'Email requerido.',
    invalidEmail: dictionary?.email_invalid_error || 'Email inválido.',
    requiredUsername: dictionary?.username_required_error || 'Nombre de usuario requerido.',
    maxLengthUsername:
      dictionary?.username_maxlength_error ||
      'El nombre de usuario no puede tener más de 50 caracteres.',
    requiredPassword: dictionary?.password_required_error || 'Contraseña requerida.',
    requiredConfirm:
      dictionary?.password_confirm_required_error || 'Confirmar contraseña requerido.',
    passwordMismatch: dictionary?.passwords_mismatch_error || 'Las contraseñas no coinciden'
  }
});

export const createRegisterErrorMap = (errorMessages: Record<string, Record<string, string>>) => {
  return (locale: string): z.ZodErrorMap =>
    (issue, ctx) => {
      const messages = errorMessages[locale] || errorMessages['en']; // fallback to English

      if (issue.code === z.ZodIssueCode.invalid_string) {
        if (issue.validation === 'email') {
          return { message: messages.invalidEmail || ctx.defaultError };
        }
      }

      if (issue.code === z.ZodIssueCode.too_small) {
        if (issue.path[0] === 'username') {
          return { message: messages.requiredUsername || ctx.defaultError };
        }

        if (issue.path[0] === 'email') {
          return { message: messages.requiredEmail || ctx.defaultError };
        }

        if (issue.path[0] === 'password') {
          return { message: messages.requiredPassword || ctx.defaultError };
        }

        if (issue.path[0] === 'confirm') {
          return { message: messages.requiredConfirm || ctx.defaultError };
        }
      }

      if (issue.code === z.ZodIssueCode.too_big) {
        if (issue.path[0] === 'username') {
          return { message: messages.maxLengthUsername || ctx.defaultError };
        }
      }

      if (issue.code === z.ZodIssueCode.custom) {
        if (issue.path[0] === 'confirm') {
          return { message: messages.passwordMismatch || ctx.defaultError };
        }
      }

      return { message: ctx.defaultError };
    };
};

export const registerSchema = z
  .object({
    email: z.string().trim().min(1).email(),
    username: z.string().max(50).trim().min(1),
    password: z.string().trim().min(1),
    confirm: z.string().trim().min(1)
  })
  .refine((data) => data.password === data.confirm, {
    path: ['confirm'] // path of error
  });
