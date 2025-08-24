import React from 'react';
import { Label } from './Label';
import Button from '@mui/material/Button';

// TODO: Replace with data from the backend
const sampleLabels = [
  {
    id: 1,
    name: 'High Priority',
    description: '',
    color: '#FF4444',
    tasks: [1],
  },
  { id: 2, name: 'Bug Fix', description: '', color: '#FF8800', tasks: [2] },
  { id: 3, name: 'Feature', description: '', color: '#00AA00', tasks: [1] },
  {
    id: 4,
    name: 'Documentation',
    description: '',
    color: '#4488FF',
    tasks: [4],
  },
];

interface LabelsViewProps {
  currentTaskId: number;
}

export const LabelsView: React.FC<LabelsViewProps> = ({ currentTaskId }) => {
  return (
    <div>
      <h2 className="text-3xl font-semibold">Labels</h2>
      <div className="transparent-scrollbar-container bg-white w-[344px] h-[407px] p-3 grid auto-cols-min auto-rows-min grid-cols-2 gap-4 overflow-scroll">
        {sampleLabels.map((label) => (
          <Label
            title={label.name}
            color={label.color}
            checked={label.tasks.includes(currentTaskId)}
          />
        ))}
        <Button
          sx={{
            width: '137px',
            height: '31px',
            borderRadius: '9999px',
            textAlign: 'center',
            verticalAlign: 'center',
            backgroundColor: '#868686',
            color: 'white',
            fontWeight: '550',
            textTransform: 'none',
            fontSize: '16px',
          }}
        >
          + Add Label
        </Button>
      </div>
    </div>
  );
};
