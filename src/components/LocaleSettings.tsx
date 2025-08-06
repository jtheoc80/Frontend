import React from 'react';
import { HStack, Button, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { getTextDirection } from '../i18n.ts';

export const LocaleSettings: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    
    // Update document direction
    document.documentElement.dir = getTextDirection();
    document.documentElement.lang = languageCode;
  };

  return (
    <>
      <HStack spacing={2} mb={4}>
        {languages.map((language) => (
          <Button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            variant={i18n.language === language.code ? "solid" : "ghost"}
            size="sm"
            colorScheme="blue"
          >
            <HStack spacing={1}>
              <Text fontSize="sm">{language.flag}</Text>
              <Text fontSize="sm">{language.name}</Text>
            </HStack>
          </Button>
        ))}
      </HStack>
      {children}
    </>
  );
};