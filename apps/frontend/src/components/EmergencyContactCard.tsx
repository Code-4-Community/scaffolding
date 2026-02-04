import React from 'react';
import { Card, Flex, Text, Box, Badge } from '@chakra-ui/react';

export type EmergencyContact = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: string;
};

export type EmergencyContactCardProps = {
  contact: EmergencyContact;
};

const PersonIcon = () => (
  <svg
    width="157px"
    height="157px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      fill="white"
    />
  </svg>
);

export default function EmergencyContactCard({
  contact,
}: EmergencyContactCardProps) {
  const { firstName, lastName, email, phone, relationship } = contact;
  const fullName = [firstName, lastName].filter(Boolean).join(' ');

  return (
    <Card.Root
      width="1484px"
      borderRadius="20px"
      borderWidth="1px"
      borderColor="gray.200"
      bg="white"
      overflow="visible"
      boxShadow="0 2px 8px rgba(0,0,0,0.08)"
    >
      <Box
        bg="#B8AF98"
        w="100%"
        h="253px"
        flexShrink={0}
        borderTopLeftRadius="20px"
        borderTopRightRadius="20px"
        position="relative"
      />

      <Card.Body pt={0} px={6} pb={6}>
        <Flex gap={6} align="flex-start">
          <Box
            flexShrink={0}
            w="200px"
            h="200px"
            borderRadius="full"
            bg="#B8AF98"
            position="relative"
            marginTop="-131px"
            boxShadow="0 4px 12px rgba(0,0,0,0.15)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            aria-hidden
          >
            <PersonIcon />
          </Box>

          <Flex direction="column" gap={1.5} flex="1" minW={0} pt={1}>
            <Text
              fontFamily="Lato, sans-serif"
              fontWeight={700}
              fontSize="48px"
              lineHeight="100%"
              letterSpacing="0%"
              color="black"
            >
              Emergency Contact
            </Text>
            <Text
              fontFamily="Lato, sans-serif"
              fontWeight={500}
              fontSize="30px"
              lineHeight="100%"
              letterSpacing="0%"
              color="black"
            >
              {fullName || '—'}
            </Text>
            <Flex gap={4} flexWrap="wrap">
              <Text
                fontFamily="Lato, sans-serif"
                fontWeight={400}
                fontSize="20px"
                lineHeight="100%"
                letterSpacing="0%"
                color="gray.700"
              >
                {email || '—'}
              </Text>
              <Text
                fontFamily="Lato, sans-serif"
                fontWeight={400}
                fontSize="20px"
                lineHeight="100%"
                letterSpacing="0%"
                color="gray.700"
              >
                {phone || '—'}
              </Text>
            </Flex>
            {relationship ? (
              <Badge
                bg="#008CA7"
                color="white"
                borderWidth="1px"
                borderColor="#013594"
                borderRadius="20px"
                padding="10px 12px"
                alignSelf="start"
                fontWeight="normal"
              >
                {relationship}
              </Badge>
            ) : null}
          </Flex>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}
