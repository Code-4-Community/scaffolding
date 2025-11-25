import React from 'react';
import { Flex, Input } from '@chakra-ui/react';
import { IoSearch } from 'react-icons/io5';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search by Keyword',
  value,
  onChange,
}) => {
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
};

export default SearchBar;
