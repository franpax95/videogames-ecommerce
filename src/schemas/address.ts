import { z } from 'zod';

export const addressFormErrorMessages = (dictionary: { [key: string]: string } | null) => ({
  en: {
    requiredTitle: dictionary?.title_required_error || 'Title is required.',
    requiredName: dictionary?.name_required_error || 'Name is required.',
    requiredAddressType: dictionary?.addressType_required_error || 'Address type is required.',
    requiredAddress: dictionary?.address_required_error || 'Address is required.',
    requiredCity: dictionary?.city_required_error || 'City is required.',
    requiredState: dictionary?.state_required_error || 'State is required.',
    lengthPostalCode:
      dictionary?.postal_code_length_error || 'Postal code must be exactly 5 characters.',
    requiredPhoneNumber: dictionary?.phone_number_required_error || 'Phone number is required.',
    invalidPhoneNumber: dictionary?.phone_number_invalid_error || 'Phone number is invalid.'
  },
  es: {
    requiredTitle: dictionary?.title_required_error || 'El título es obligatorio.',
    requiredName: dictionary?.name_required_error || 'El nombre es obligatorio.',
    requiredAddressType:
      dictionary?.addressType_required_error || 'El tipo de dirección es obligatorio.',
    requiredAddress: dictionary?.address_required_error || 'La dirección es obligatoria.',
    requiredCity: dictionary?.city_required_error || 'La ciudad es obligatoria.',
    requiredState: dictionary?.state_required_error || 'El país es obligatorio.',
    lengthPostalCode:
      dictionary?.postal_code_length_error || 'El código postal debe tener 5 dígitos.',
    requiredPhoneNumber:
      dictionary?.phone_number_required_error || 'El número de teléfono es obligatorio.',
    invalidPhoneNumber:
      dictionary?.phone_number_invalid_error || 'El número de teléfono no es válido.'
  }
});

export const createAddressFormErrorMap = (
  errorMessages: Record<string, Record<string, string>>
) => {
  return (locale: string): z.ZodErrorMap =>
    (issue, ctx) => {
      const messages = errorMessages[locale] || errorMessages['en']; // fallback to English

      if (issue.code === z.ZodIssueCode.too_small) {
        if (issue.path[0] === 'title') {
          return { message: messages.requiredTitle || ctx.defaultError };
        }

        if (issue.path[0] === 'name') {
          return { message: messages.requiredName || ctx.defaultError };
        }

        if (issue.path[0] === 'address_type') {
          return { message: messages.requiredAddressType || ctx.defaultError };
        }

        if (issue.path[0] === 'address') {
          return { message: messages.requiredAddress || ctx.defaultError };
        }

        if (issue.path[0] === 'city') {
          return { message: messages.requiredCity || ctx.defaultError };
        }

        if (issue.path[0] === 'state') {
          return { message: messages.requiredAddress || ctx.defaultError };
        }

        if (issue.path[0] === 'postal_code') {
          return { message: messages.lengthPostalCode || ctx.defaultError };
        }

        if (issue.path[0] === 'phone_number') {
          return { message: messages.requiredPhoneNumber || ctx.defaultError };
        }
      }

      if (issue.code === z.ZodIssueCode.too_big && issue.path[0] === 'postal_code') {
        return { message: messages.lengthPostalCode || ctx.defaultError };
      }

      if (issue.code === z.ZodIssueCode.custom) {
        if (issue.path[0] === 'phone_number') {
          return { message: messages.invalidPhoneNumber || ctx.defaultError };
        }
      }

      return { message: ctx.defaultError };
    };
};

export const addressSchema = z.object({
  title: z.string().trim().min(1),
  name: z.string().trim().min(1),
  address_type: z.string().trim().min(1),
  address: z.string().trim().min(1),
  city: z.string().trim().min(1),
  state: z.string().trim().min(1),
  postal_code: z.string().trim().min(5).max(5),
  phone_number: z.string().trim().min(1)
  // TODO: validate phone numbers
  // .refine(validator.isMobilePhone, {
  //   message: 'Insert a valid phone number',
  //   path: ['phone_number'] // path of error
  // })
});
