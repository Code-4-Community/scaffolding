import { Box, Flex, Text, Heading } from '@chakra-ui/react';

import React from 'react';

interface PendingReviewCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}

const PendingReviewCard: React.FC<PendingReviewCardProps> = ({
  title,
  value,
  description,
  icon,
}) => {
  return (
    <Box
      borderWidth="2px"
      borderColor="black"
      borderRadius="16px"
      padding="16px"
      bg="white"
      width="250px"
      height="158px"
      display="flex"
      flexDirection="column"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb="15px"
        px="16px"
      >
        <Heading as="h3" size="md" fontWeight="600" color="#686868">
          {title}
        </Heading>
        <Flex
          alignItems="center"
          justifyContent="center"
          width="24px"
          height="24px"
          borderRadius="full"
          bg="#204AA0"
          color="white"
        >
          {icon}
        </Flex>
      </Flex>
      <Text
        fontSize="32px"
        fontWeight="600"
        mb="15px"
        color="#000000"
        px="16px"
      >
        {value}
      </Text>
      <Text as="h4" fontWeight="600" color="#686868" px="16px">
        {description}
      </Text>
    </Box>
  );
};

export default PendingReviewCard;
