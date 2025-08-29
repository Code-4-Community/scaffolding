import { styled } from '@mui/material/styles';
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { TaskCategory } from '../types/types';

interface CategoryButtonProps {
  inputCategory?: TaskCategory;
}

export const CategoryButton = ({ inputCategory }: CategoryButtonProps) => {
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(
    inputCategory || null,
  );

  return (
    <FormControl>
      <h1 className="text-3xl font-medium mb-4">Category</h1>
      <RadioGroup
        row
        name="use-radio-group"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value as TaskCategory)}
      >
        {Object.values(TaskCategory).map((category: string) => (
          <FormControlLabel
            key={category}
            value={category}
            label={category}
            control={<Radio color="default" />}
            labelPlacement="start"
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
