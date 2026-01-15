import React from 'react';
import { Card, Flex, Text, Box, Image } from '@chakra-ui/react';

export type DashboardCardProps = {
  className?: string;
  description: string;
  icon: string;
  title: string;
  value: number;
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
      borderRadius="32px"
      borderWidth="3px"
      borderColor="black"
      bg="white"
      pl={8}
      pr={8}
      className={className}
    >
      <Card.Body>
        <Flex justify="space-between" align="flex-start" mb={8}>
          <Text fontSize="l" fontWeight="normal" lineHeight="1.3" maxW="70%">
            {title}
          </Text>
          <Box flexShrink={0}>
            <Image
              src={icon}
              alt={`${title} icon`}
              width="25px"
              height="25px"
            />
          </Box>
        </Flex>

        <Text fontSize="2xl" fontWeight="bold" mb={8}>
          {value}
        </Text>

        <Text fontSize="l" fontWeight="normal">
          {description}
        </Text>
      </Card.Body>
    </Card.Root>
  );
}
