import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CheckIcon from '@mui/icons-material/Check';
import CircleIcon from '@mui/icons-material/Circle';
import React, { useState, useEffect } from 'react';

interface LabelCardProps {
  id: number;
  title: string;
  color: string;
  defaultChecked: boolean;

  changeCheckedState: (
    targetLabelId: number,
    wasAlreadyChecked: boolean,
  ) => void;
}

export const LabelCard: React.FC<LabelCardProps> = ({
  id,
  title,
  color,
  defaultChecked,
  changeCheckedState,
}) => {
  const [currentlyChecked, setCurrentlyChecked] = useState(defaultChecked);
  console.log('defaultChecked:', currentlyChecked);
  useEffect(() => {
    setCurrentlyChecked(defaultChecked);
  }, [defaultChecked]);

  const handleChange = () => {
    setCurrentlyChecked(!currentlyChecked);
    changeCheckedState(id, currentlyChecked);
  };

  return (
    <div
      className="flex w-[137px] h-[31px] rounded-full text-center align-middle"
      style={{ backgroundColor: color }}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={currentlyChecked}
            onChange={handleChange}
            icon={<CircleIcon sx={{ fontSize: 24 }} className="text-white" />}
            checkedIcon={
              <CheckIcon
                sx={{ fontSize: 20 }}
                className="rounded-full text-black bg-white"
              />
            }
          />
        }
        label={title.length >= 10 ? title.slice(0, 9) + '..' : title}
        labelPlacement="start"
        className="flex justify-between items-center w-full"
        sx={{ m: 0, pl: 2 }}
      />
    </div>
  );
};
