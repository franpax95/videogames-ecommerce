import { TranslationsContext } from '@/contexts/TranslationsContext';
import { useContext } from 'react';

export const useTranslations = () => {
  const context = useContext(TranslationsContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }
  return context;
};
