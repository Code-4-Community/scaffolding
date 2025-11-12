import { Box, Flex, Text, Icon } from '@chakra-ui/react';
import {
  CheckCircleIcon,
  TimeIcon,
  CloseIcon,
  AtSignIcon,
} from '@chakra-ui/icons';
import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ElementType;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
}) => {
  return (
    <Box
      borderWidth="1px"
      borderColor="white"
      rounded="lg"
      bg="white"
      shadow="sm"
      w="260px"
      h="150px"
      textAlign="center"
      p="4"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Icon as={icon} w={5} h={5} color="#204AA0" alignSelf="center" />
      <Text fontSize="sm" fontWeight="medium" color="black">
        {title}
      </Text>
      <Text fontSize="2xl" fontWeight="bold" color="black">
        {value}
      </Text>
      <Text fontSize="sm" color="gray.500">
        {subtitle}
      </Text>
    </Box>
  );
};

const Divider = () => (
  <Box
    position="relative"
    w="65px"
    h="150px"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    <Box
      position="absolute"
      inset="0"
      bgGradient="repeating-linear(45deg, #F4B0CF, #F4B0CF 10px, white 10px, white 20px)"
      opacity={0.3}
      rounded="md"
    />
    <Box
      position="relative"
      bg="#204AA0"
      color="white"
      fontWeight="semibold"
      px="3"
      py="1"
      rounded="lg"
      shadow="md"
    >
      65
    </Box>
  </Box>
);

const ReviewStats: React.FC = () => {
  return (
    <Flex
      align="center"
      justify="center"
      gap="65px"
      alignSelf="stretch"
      p="20px"
      pb="32px"
      border="1px solid #204AA0"
      rounded="xl"
      bg="gray.50"
      w="1204px"
      mx="auto"
    >
      <StatCard
        title="Total Applications"
        value={298}
        subtitle="All time submissions"
        icon={AtSignIcon}
      />
      <Divider />
      <StatCard
        title="Pending Review"
        value={52}
        subtitle="Awaiting decision"
        icon={TimeIcon}
      />
      <Divider />
      <StatCard
        title="Rejected"
        value={12}
        subtitle="Not matched"
        icon={CloseIcon}
      />
      <Divider />
      <StatCard
        title="Approved"
        value={102}
        subtitle="Active volunteers"
        icon={CheckCircleIcon}
      />
    </Flex>
  );
};

export default ReviewStats;
