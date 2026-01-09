import React from 'react';
import { Box, Heading, Flex, Link, Text } from '@chakra-ui/react';
import NavbarItem from './NavBarItem';
import SearchBar from './SearchBar';
import { FaHouse } from 'react-icons/fa6';
import { FaBell } from 'react-icons/fa';
import { IoIosSettings } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';

export type NavBarProps = {
  logo: React.ReactNode;
};

export default function NavBar({ logo }: NavBarProps) {
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
        <Flex justifyContent="space-between" alignItems="center" mb="12px">
          <Heading
            as="h3"
            size="md"
            fontWeight="600"
            color="white"
            fontSize="20px"
          >
            {logo}
          </Heading>
        </Flex>
        <SearchBar />
        <Flex direction="column" width="100%">
          <NavbarItem href="#dashboard" label="Dashboard" icon={<FaHouse />} />
          <NavbarItem
            href="#notification"
            label="Notification"
            icon={<FaBell />}
          />
          <NavbarItem
            href="#setting"
            label="Setting"
            icon={<IoIosSettings />}
          />
        </Flex>
      </Box>

      <Link
        href="#profile"
        width="100%"
        _hover={{ textDecoration: 'none' }}
        _focus={{ outline: 'none', boxShadow: 'none' }}
        _focusVisible={{ outline: 'none', boxShadow: 'none' }}
      >
        <Flex
          align="center"
          gap="12px"
          padding="12px 16px"
          borderRadius="md"
          bg="#204AA0"
          cursor="pointer"
          width="100%"
        >
          <Flex
            width="32px"
            height="32px"
            borderRadius="full"
            bg="white"
            align="center"
            justify="center"
            fontSize="14px"
            color="#204AA0"
            fontWeight="bold"
          >
            <CgProfile size="20px" />
          </Flex>

          <Text fontSize="16px" fontWeight="500" color="white">
            Profile
          </Text>
        </Flex>
      </Link>
    </Box>
  );
}
