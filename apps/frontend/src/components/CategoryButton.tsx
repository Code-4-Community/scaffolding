import { styled } from '@mui/material/styles';
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useRadioGroup } from '@mui/material/RadioGroup';
import { useState } from 'react';
import { TaskCategory } from '../types/types';

export const CategoryButton = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  return (
    <FormControl>
      <h1 className="text-3xl font-medium mb-4">Category</h1>
      <RadioGroup
        row
        name="use-radio-group"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {Object.values(TaskCategory).map((category: string) => (
          <FormControlLabel
            key={category}
            value={category}
            label={category}
            checked={selectedCategory === category}
            control={<Radio color="default" />}
            labelPlacement="start"
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
