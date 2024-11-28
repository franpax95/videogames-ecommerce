import { z } from 'zod';

export const loginFormErrorMessages = (dictionary: { [key: string]: string } | null) => ({
  en: {
    requiredUsername: dictionary?.identifier_required_error || 'Username is required.',
    requiredPassword: dictionary?.password_required_error || 'Password is required.'
  },
  es: {
    requiredUsername: dictionary?.identifier_required_error || 'Nombre de usuario requerido.',
    requiredPassword: dictionary?.password_required_error || 'Contraseña requerida.'
  }
});

export const createLoginErrorMap = (errorMessages: Record<string, Record<string, string>>) => {
  return (locale: string): z.ZodErrorMap =>
    (issue, ctx) => {
      const messages = errorMessages[locale] || errorMessages['en']; // fallback to English

      if (issue.code === z.ZodIssueCode.too_small) {
        if (issue.path[0] === 'identifier') {
          return { message: messages.requiredUsername || ctx.defaultError };
        }

        if (issue.path[0] === 'password') {
          return { message: messages.requiredPassword || ctx.defaultError };
        }
      }

      return { message: ctx.defaultError };
    };
};

export const loginSchema = z.object({
  identifier: z.string().trim().min(1),
  password: z.string().trim().min(1)
});
