import React, { useEffect, useState } from 'react';
import { LabelCard } from './LabelCard';
import { Label, Task } from 'types/types';
import apiClient from '@api/apiClient';
import Button from '@mui/material/Button';
import { LabelPopup } from './LabelPopup';

interface LabelsViewProps {
  currentTask?: Task;
  taskId?: number;
  selectedLabelIds?: number[];
  onLabelSelectionChange?: (labelIds: number[]) => void;
}

export const LabelsView: React.FC<LabelsViewProps> = ({
  currentTask,
  taskId,
  selectedLabelIds = [],
  onLabelSelectionChange,
}) => {
  const [labelData, setLabelData] = useState<Label[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [taskLabels, setTaskLabels] = useState<number[]>([]);

  const isNewTask = !currentTask?.id && !taskId;

  const currentLabelIds = isNewTask ? selectedLabelIds : taskLabels;

  const fetchData = async () => {
    const data = await apiClient.getLabels();
    setLabelData(data);
  };

  const fetchTaskLabels = async () => {
    if (!currentTask?.id && !taskId) return;

    try {
      const task = await apiClient.getTaskById(currentTask?.id || taskId!);
      const labelIds = task.labels?.map((label) => label.id) || [];
      setTaskLabels(labelIds);
    } catch (error) {
      console.error('Error fetching task labels:', error);
      setTaskLabels([]);
    }
  };

  useEffect(() => {
    fetchData();
    if (!isNewTask) {
      fetchTaskLabels();
    }
  }, [currentTask?.id, taskId, isNewTask]);

  const changeCheckedState = async (
    targetLabelId: number,
    wasAlreadyChecked: boolean,
  ) => {
    if (isNewTask) {
      const newLabelIds = wasAlreadyChecked
        ? selectedLabelIds.filter((id) => id !== targetLabelId)
        : [...selectedLabelIds, targetLabelId];

      onLabelSelectionChange?.(newLabelIds);
      return;
    }

    const currentTaskId = currentTask?.id || taskId;
    if (!currentTaskId) return;

    try {
      if (wasAlreadyChecked) {
        await apiClient.removeTaskLabels(currentTaskId, [targetLabelId]);
      } else {
        await apiClient.addTaskLabels(currentTaskId, [targetLabelId]);
      }
      await fetchTaskLabels();
    } catch (error) {
      console.error('Error updating task labels:', error);
    }
  };

  const handleLabelCreated = async (newLabel: Label) => {
    if (isNewTask) {
      const newLabelIds = [...selectedLabelIds, newLabel.id];
      onLabelSelectionChange?.(newLabelIds);
      setLabelData((prev) => [...prev, newLabel]);
      setShowPopup(false);
      return;
    }

    const currentTaskId = currentTask?.id || taskId;
    if (!currentTaskId) return;

    try {
      await apiClient.addTaskLabels(currentTaskId, [newLabel.id]);
      setLabelData((prev) => [...prev, newLabel]);
      setShowPopup(false);
      await fetchTaskLabels();
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
            defaultChecked={currentLabelIds.includes(label.id)}
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
          onCancel={() => setShowPopup(false)}
          onLabelCreated={handleLabelCreated}
        />
      )}
    </div>
  );
};
