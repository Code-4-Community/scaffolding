import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CheckIcon from '@mui/icons-material/Check';
import CircleIcon from '@mui/icons-material/Circle';
import React, { useState } from 'react';

interface LabelProps {
  title: string;
  color: string;
  checked: boolean;
}

export const Label: React.FC<LabelProps> = ({ title, color, checked }) => {
  const [currentlyChecked, setCurrentlyChecked] = useState(checked);

  return (
    <div
      className="flex w-[137px] h-[31px] rounded-full"
      style={{ backgroundColor: color }}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={currentlyChecked}
            onChange={() => setCurrentlyChecked(!currentlyChecked)}
            icon={<CircleIcon sx={{ fontSize: 20 }} className="text-white" />}
            checkedIcon={
              <CheckIcon
                sx={{ fontSize: 20 }}
                className="rounded-full text-black bg-white"
              />
            }
          />
        }
        label={title}
        labelPlacement="start"
      />
    </div>
  );
};
