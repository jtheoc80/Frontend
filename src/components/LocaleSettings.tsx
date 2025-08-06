import React from 'react';
import { HStack, Button, Text } from '@chakra-ui/react';
import { useLocale } from '../contexts/LocaleContext.tsx';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export const LocaleSettings: React.FC = () => {
  const { currentLocale, changeLocale } = useLocale();

  return (
    <HStack spacing={2}>
      {languages.map((language) => (
        <Button
          key={language.code}
          onClick={() => changeLocale(language.code)}
          variant={currentLocale === language.code ? "solid" : "ghost"}
          size="sm"
          color="white"
          bg={currentLocale === language.code ? 'whiteAlpha.300' : 'transparent'}
          _hover={{ bg: 'whiteAlpha.200' }}
        >
          <HStack spacing={1}>
            <Text fontSize="sm">{language.flag}</Text>
            <Text fontSize="sm">{language.name}</Text>
          </HStack>
        </Button>
      ))}
    </HStack>
  );
};