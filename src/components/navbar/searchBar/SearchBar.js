import React from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Box,
  VStack,
  Text,
  Flex,
  useColorMode,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useSearch } from "contexts/SearchContext";
import { useTranslation } from 'react-i18next';

export function SearchBar(props) {
  // Pass the computed styles into the `__css` prop
  const { variant, background, children, placeholder, borderRadius, ...rest } = props;
  
  // Chakra Color Mode
  const searchIconColor = useColorModeValue("gray.700", "white");
  const inputBg = useColorModeValue("secondaryGray.300", "navy.900");
  const inputText = useColorModeValue("gray.700", "gray.100");
  const dropdownBg = useColorModeValue("white", "navy.800");
  const dropdownBorder = useColorModeValue("gray.200", "whiteAlpha.200");
  const hoverBg = useColorModeValue("gray.50", "navy.700");
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("gray.500", "gray.400");
  
  const { colorMode } = useColorMode();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const {
    searchQuery,
    searchResults,
    isSearchOpen,
    handleSearchChange,
    handleSearchSelect,
  } = useSearch();

  const handleInputChange = (e) => {
    handleSearchChange(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleSearchChange('');
    }
  };

  return (
    <Box position="relative" id="search-container" {...rest}>
      <InputGroup w={{ base: "100%", md: "200px" }}>
        <InputLeftElement
          children={
            <IconButton
              bg='inherit'
              borderRadius='inherit'
              _hover='none'
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}
              icon={
                <SearchIcon color={searchIconColor} w='15px' h='15px' />
              }
            />
          }
        />
        <Input
          variant='search'
          fontSize='sm'
          bg={background ? background : inputBg}
          color={inputText}
          fontWeight='500'
          _placeholder={{ color: "gray.400", fontSize: "14px" }}
          borderRadius={borderRadius ? borderRadius : "30px"}
          placeholder={placeholder ? placeholder : t('search')}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          dir={isRTL ? "rtl" : "ltr"}
        />
      </InputGroup>

      {/* Search Results Dropdown */}
      {isSearchOpen && searchResults.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          right="0"
          mt="2"
          bg={dropdownBg}
          border="1px solid"
          borderColor={dropdownBorder}
          borderRadius="12px"
          boxShadow="0px 4px 20px rgba(112, 144, 176, 0.15)"
          zIndex={1000}
          maxH="300px"
          overflowY="auto"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <VStack spacing={0} align="stretch">
            {searchResults.map((route, index) => (
              <Flex
                key={index}
                px="16px"
                py="12px"
                cursor="pointer"
                _hover={{ bg: hoverBg }}
                onClick={() => handleSearchSelect(route)}
                align="center"
                gap="12px"
                borderBottom={index < searchResults.length - 1 ? "1px solid" : "none"}
                borderColor={dropdownBorder}
              >
                {route.icon && (
                  <Box
                    color={iconColor}
                    w="16px"
                    h="16px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {route.icon}
                  </Box>
                )}
                <Text
                  fontSize="14px"
                  fontWeight="500"
                  color={textColor}
                  textAlign={isRTL ? "right" : "left"}
                >
                  {t(route.name)}
                </Text>
              </Flex>
            ))}
          </VStack>
        </Box>
      )}

      {/* No Results Message */}
      {isSearchOpen && searchQuery.trim() && searchResults.length === 0 && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          right="0"
          mt="2"
          bg={dropdownBg}
          border="1px solid"
          borderColor={dropdownBorder}
          borderRadius="12px"
          boxShadow="0px 4px 20px rgba(112, 144, 176, 0.15)"
          zIndex={1000}
          p="16px"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <Text
            fontSize="14px"
            color={textColor}
            textAlign="center"
          >
            {t('noResultsFound')}
          </Text>
        </Box>
      )}
    </Box>
  );
}
