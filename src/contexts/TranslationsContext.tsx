'use client';

import React, { createContext, ReactNode } from 'react';
import { Locale } from '@/types/locale';
import { Dictionaries } from '@/types/Dictionaries';

interface TranslationsContextType {
  locale: Locale;
  dictionaries: Dictionaries;
}

interface TranslationsProviderProps extends TranslationsContextType {
  children: ReactNode;
}

export const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined);

export const TranslationsProvider: React.FC<TranslationsProviderProps> = ({
  locale,
  dictionaries,
  children
}) => {
  return (
    <TranslationsContext.Provider
      value={{
        locale,
        dictionaries
      }}
    >
      {children}
    </TranslationsContext.Provider>
  );
};
