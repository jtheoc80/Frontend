// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuButton, MenuList, MenuItem, HStack, Text } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { getTextDirection } from '../../i18n.ts';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    
    // Update document direction
    document.documentElement.dir = getTextDirection();
    document.documentElement.lang = languageCode;
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        variant="ghost"
        size="sm"
        color="white"
        _hover={{ bg: 'whiteAlpha.200' }}
      >
        <HStack spacing={2}>
          <Text>{currentLanguage.flag}</Text>
          <Text>{currentLanguage.name}</Text>
        </HStack>
      </MenuButton>
      <MenuList>
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            bg={i18n.language === language.code ? 'blue.50' : 'transparent'}
          >
            <HStack spacing={2}>
              <Text>{language.flag}</Text>
              <Text>{language.name}</Text>
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default LanguageSwitcher;