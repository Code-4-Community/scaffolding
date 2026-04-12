import React from 'react';
import { Box, Heading, Flex, Link, Text } from '@chakra-ui/react';
import NavbarItem from './NavBarItem';
import {
  FaHouse,
  FaPerson,
  FaRegFile,
  FaRightFromBracket,
} from 'react-icons/fa6';
import { UserType } from '@api/types';

export type NavBarProps = {
  logo: React.ReactNode;
  userType: UserType;
};

export default function NavBar({ logo, userType }: NavBarProps) {
  return (
    <Box
      display="flex"
      width="240px"
      height="100vh"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="flex-start"
      flexShrink={0}
      padding="16px"
      bg="#013594"
    >
      <Box width="100%">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="2xl" fontWeight="600" color="white" mb="24px">
            {logo}
          </Heading>
        </Flex>
        <Flex direction="column" width="100%" paddingTop="16px">
          {userType === UserType.ADMIN && (
            <NavbarItem
              href="#dashboard"
              label="Dashboard"
              icon={<FaHouse />}
            />
          )}
          {userType === UserType.STANDARD && (
            <NavbarItem
              href="/candidate/view-application"
              label="My Application"
              icon={<FaPerson />}
            />
          )}
          {userType === UserType.STANDARD && (
            <NavbarItem
              href="/candidate/upload-forms"
              label="My Forms"
              icon={<FaRegFile />}
            />
          )}
        </Flex>
      </Box>

      <Link
        href="#logout"
        width="100%"
        _hover={{ textDecoration: 'none' }}
        _focus={{ outline: 'none', boxShadow: 'none' }}
        _focusVisible={{ outline: 'none', boxShadow: 'none' }}
      >
        <Flex
          align="center"
          gap="18px"
          padding="16px 4px"
          borderRadius="md"
          cursor="pointer"
          color="white"
          _focus={{ outline: 'none', boxShadow: 'none' }}
          _focusVisible={{ outline: 'none', boxShadow: 'none' }}
        >
          <Box fontSize="18px" lineHeight={1} display="flex">
            <FaRightFromBracket aria-hidden />
          </Box>
          <Text fontSize="14px" fontWeight="500">
            Log Out
          </Text>
        </Flex>
      </Link>
    </Box>
  );
}
