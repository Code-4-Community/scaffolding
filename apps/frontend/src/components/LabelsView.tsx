import React, { useState } from 'react';
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
  const [labelData, setLabelData] = useState(sampleLabels);

  const changeCheckedState = (
    targetLabelId: number,
    wasAlreadyChecked: boolean,
  ) => {
    const updatedLabels = labelData.map((label) => {
      if (label.id === targetLabelId) {
        const newTasks = wasAlreadyChecked
          ? label.tasks.filter((id) => id !== currentTaskId)
          : [...label.tasks, currentTaskId];

        return { ...label, tasks: newTasks };
      }

      return label;
    });

    setLabelData(updatedLabels);
  };
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-2">Labels</h2>
      <div className="transparent-scrollbar-container bg-white w-fit h-[407px] rounded-lg p-3 pr-6 grid auto-cols-min auto-rows-min grid-cols-2 gap-x-4 gap-y-2 overflow-scroll">
        {sampleLabels.map((label) => (
          <Label
            key={label.id}
            id={label.id}
            title={label.name}
            color={label.color}
            defaultChecked={label.tasks.includes(currentTaskId)}
            changeCheckedState={changeCheckedState}
          />
        ))}
      </div>
    </div>
  );
};
