import React, { useEffect, useState } from 'react';
import { LabelCard } from './LabelCard';
import { Label, Task } from 'types/types';
import apiClient from '@api/apiClient';
import Button from '@mui/material/Button';
import { LabelPopup } from './LabelPopup';

interface LabelsViewProps {
  currentTask: Task;
}

export const LabelsView: React.FC<LabelsViewProps> = ({ currentTask }) => {
  const [labelData, setLabelData] = useState<Label[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  const fetchData = async () => {
    const data = await apiClient.getLabels();
    setLabelData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const changeCheckedState = (
    targetLabelId: number,
    wasAlreadyChecked: boolean,
  ) => {
    const updatedLabels = labelData.map((label) => {
      if (label.id === targetLabelId) {
        const newTasks = wasAlreadyChecked
          ? label.tasks.filter((task) => task.id !== currentTask.id)
          : [...label.tasks, currentTask];

        return { ...label, tasks: newTasks };
      }

      return label;
    });

    setLabelData(updatedLabels);
  };
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-2">Labels</h2>
      <div className="transparent-scrollbar-container bg-slate-100 w-[344px] h-[147px] rounded-lg p-3 pr-6 grid auto-cols-min auto-rows-min grid-cols-2 gap-x-4 gap-y-2 overflow-scroll">
        {labelData.map((label) => (
          <LabelCard
            key={label.id}
            id={label.id}
            title={label.name}
            color={label.color}
            defaultChecked={label.tasks.includes(currentTask)}
            changeCheckedState={changeCheckedState}
          />
        ))}
      </div>
      <Button
        sx={{
          color: '#424242',
          fontWeight: '550',
          textTransform: 'none',
          fontSize: '16px',
        }}
        onClick={() => {
          setShowPopup(true);
        }}
      >
        {!showPopup && '+ Add Label'}
      </Button>
      {showPopup && (
        <LabelPopup
          taskId={currentTask.id}
          onCancel={() => setShowPopup(false)}
          onLabelCreated={(newLabel) => {
            const labelWithTask = {
              ...newLabel,
              tasks: [currentTask],
            };
            setLabelData([...labelData, labelWithTask]);
            setShowPopup(false);
          }}
        />
      )}
    </div>
  );
};
