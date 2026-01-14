import React from 'react';
import { Flex, Input } from '@chakra-ui/react';
import { IoSearch } from 'react-icons/io5';

export type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchBar({
  placeholder = 'Search by Keyword',
  value,
  onChange,
}: SearchBarProps) {
  return (
    <Flex align="center" bg="#204AA0" width="100%" borderRadius="4px" px="8px">
      <IoSearch color="white" size="16px" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        fontSize="10px"
        color="white"
        border="none"
        bg="transparent"
        _focusVisible={{
          outline: 'none',
        }}
        _placeholder={{
          color: 'white',
        }}
      />
    </Flex>
  );
}
