import React from 'react';
import { Card, Flex, Text, Box, Image } from '@chakra-ui/react';

export type DashboardCardProps = {
  className?: string;
  description: string;
  icon: string;
  title: string;
  value: number;
  TODO: Remove, I am adding this to break frontend for GitHub Actions
};

export default function DashboardCard({
  title,
  value,
  description,
  icon,
  className,
}: DashboardCardProps) {
  return (
    <Card.Root
      width="100%"
      minHeight="280px"
      borderRadius="32px"
      borderWidth="3px"
      borderColor="black"
      bg="white"
      p={8}
      className={className}
    >
      <Card.Body>
        <Flex justify="space-between" align="flex-start" mb={8}>
          <Text fontSize="2xl" fontWeight="normal" lineHeight="1.3" maxW="70%">
            {title}
          </Text>
          <Box flexShrink={0}>
            <Image
              src={icon}
              alt={`${title} icon`}
              width="48px"
              height="48px"
            />
          </Box>
        </Flex>

        <Text fontSize="6xl" fontWeight="bold" mb={8}>
          {value}
        </Text>

        <Text fontSize="xl" fontWeight="normal" color="gray.600">
          {description}
        </Text>
      </Card.Body>
    </Card.Root>
  );
}
