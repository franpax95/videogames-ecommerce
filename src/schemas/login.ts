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

export const loginSchema = z.object({
  identifier: z.string().trim().min(1),
  password: z.string().trim().min(1)
});
