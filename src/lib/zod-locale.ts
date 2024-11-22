import { z } from 'zod';

export const createErrorMap = (errorMessages: Record<string, Record<string, string>>) => {
  return (locale: string): z.ZodErrorMap =>
    (issue, ctx) => {
      const messages = errorMessages[locale] || errorMessages['en']; // fallback to English

      if (issue.code === z.ZodIssueCode.invalid_string) {
        if (issue.validation === 'email') {
          return { message: messages.invalidEmail || ctx.defaultError };
        }
      }

      if (issue.code === z.ZodIssueCode.too_small) {
        if (issue.path[0] === 'identifier' || issue.path[0] === 'username') {
          return { message: messages.requiredUsername || ctx.defaultError };
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

export const setZodLocale = (errorMap: ReturnType<typeof createErrorMap>, locale: string) => {
  z.setErrorMap(errorMap(locale));
};
