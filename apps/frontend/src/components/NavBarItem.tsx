import React from 'react';
import { Flex, Text, Box, Link } from '@chakra-ui/react';

interface NavbarItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NavbarItem: React.FC<NavbarItemProps> = ({ href, label, icon }) => {
  return (
    <Link
      href={href}
      _focus={{ outline: 'none', boxShadow: 'none' }}
      _focusVisible={{ outline: 'none', boxShadow: 'none' }}
      _hover={{ textDecoration: 'none' }}
    >
      <Flex
        align="center"
        gap="12px"
        padding="12px 16px"
        borderRadius="md"
        cursor="pointer"
        as="h3"
        fontWeight="400"
        color="white"
        _focus={{ outline: 'none', boxShadow: 'none' }}
        _focusVisible={{ outline: 'none', boxShadow: 'none' }}
      >
        <Box fontSize="20px">{icon}</Box>

        <Text fontSize="16px" fontWeight="500">
          {label}
        </Text>
      </Flex>
    </Link>
  );
};

export default NavbarItem;
