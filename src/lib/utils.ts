import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Shadcn utils
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
