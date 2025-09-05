import React, { useEffect, useState } from 'react';
import { LabelCard } from './LabelCard';
import { Label, Task } from 'types/types';
import apiClient from '@api/apiClient';
import Button from '@mui/material/Button';
import { LabelPopup } from './LabelPopup';

interface LabelsViewProps {
  currentTask?: Task;
  taskId?: number;
}

export const LabelsView: React.FC<LabelsViewProps> = ({
  currentTask,
  taskId,
}) => {
  const [labelData, setLabelData] = useState<Label[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [taskLabels, setTaskLabels] = useState<number[]>([]);

  const fetchData = async () => {
    const data = await apiClient.getLabels();
    setLabelData(data);
  };

  const fetchTaskLabels = async () => {
    if (!currentTask?.id && !taskId) return;

    try {
      const task = await apiClient.getTaskById(currentTask?.id || taskId!);
      setTaskLabels(task.labels?.map((label) => label.id) || []);
    } catch (error) {
      console.error('Error fetching task labels:', error);
      setTaskLabels([]);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTaskLabels();
  }, [currentTask?.id, taskId]);

  const changeCheckedState = async (
    targetLabelId: number,
    wasAlreadyChecked: boolean,
  ) => {
    const currentTaskId = currentTask?.id || taskId;
    if (!currentTaskId) return;

    try {
      if (wasAlreadyChecked) {
        await apiClient.removeTaskLabels(currentTaskId, [targetLabelId]);
        setTaskLabels((prev) => prev.filter((id) => id !== targetLabelId));
      } else {
        await apiClient.addTaskLabels(currentTaskId, [targetLabelId]);
        setTaskLabels((prev) => [...prev, targetLabelId]);
      }
    } catch (error) {
      console.error('Error updating task labels:', error);
    }
  };

  const handleLabelCreated = async (newLabel: Label) => {
    const currentTaskId = currentTask?.id || taskId;
    if (!currentTaskId) {
      setLabelData((prev) => [...prev, newLabel]);
      setShowPopup(false);
      return;
    }

    try {
      await apiClient.addTaskLabels(currentTaskId, [newLabel.id]);
      setTaskLabels((prev) => [...prev, newLabel.id]);
      setLabelData((prev) => [...prev, newLabel]);
      setShowPopup(false);
    } catch (error) {
      console.error('Error adding new label to task:', error);
    }
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
            defaultChecked={taskLabels.includes(label.id)}
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
          taskId={currentTask?.id || taskId || 0}
          onCancel={() => setShowPopup(false)}
          onLabelCreated={handleLabelCreated}
        />
      )}
    </div>
  );
};
