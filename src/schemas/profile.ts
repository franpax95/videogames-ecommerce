import { z } from 'zod';

export const profileFormErrorMessages = (dictionary: { [key: string]: string } | null) => ({
  en: {
    requiredEmail: dictionary?.email_required_error || 'Email is required.',
    invalidEmail: dictionary?.email_invalid_error || 'Invalid email address.',
    requiredUsername: dictionary?.username_required_error || 'Username is required.',
    maxLengthUsername:
      dictionary?.username_maxlength_error || 'Username must be less than 50 characters.'
  },
  es: {
    requiredEmail: dictionary?.identifier_required_error || 'Email requerido.',
    invalidEmail: dictionary?.email_invalid_error || 'Email inválido.',
    requiredUsername: dictionary?.username_required_error || 'Nombre de usuario requerido.',
    maxLengthUsername:
      dictionary?.username_maxlength_error ||
      'El nombre de usuario no puede tener más de 50 caracteres.'
  }
});

export const profileSchema = z.object({
  email: z.string().trim().min(1).email(),
  username: z.string().max(50).trim().min(1),
  firstname: z.string().trim(),
  lastname: z.string().trim()
});
