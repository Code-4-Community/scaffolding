import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { TaskCategory } from '../types/types';

interface CategoryButtonProps {
  value: TaskCategory;
  onChange: (newCategory: TaskCategory) => void;
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({
  value,
  onChange,
}) => {
  return (
    <FormControl className="flex flex-col">
      <h1 className="text-3xl font-medium mb-4 ml-4">Category</h1>
      <RadioGroup
        row
        name="use-radio-group"
        value={value}
        onChange={(e) => onChange(e.target.value as TaskCategory)}
      >
        {Object.values(TaskCategory).map((category: string) => (
          <FormControlLabel
            key={category}
            value={category}
            label={category}
            control={<Radio color="default" />}
            labelPlacement="start"
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '1.5rem',
                fontWeight: 400,
              },
            }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
