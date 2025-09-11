import React, { useEffect, useState, useCallback } from 'react';
import { LabelCard } from './LabelCard';
import { Label, Task } from 'types/types';
import apiClient from '@api/apiClient';
import { Button, Snackbar } from '@mui/material';
import { LabelPopup } from './LabelPopup';
import EditDeleteLabelPopup from './EditDeleteLabelPopup';

interface LabelsViewProps {
  currentTask?: Task;
  taskId?: number;
  selectedLabelIds?: number[];
  onLabelSelectionChange?: (labelIds: number[]) => void;
  onLabelsChanged?: () => void;
}

export const LabelsView: React.FC<LabelsViewProps> = ({
  currentTask,
  taskId,
  selectedLabelIds = [],
  onLabelSelectionChange,
  onLabelsChanged,
}) => {
  const [labelData, setLabelData] = useState<Label[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [taskLabels, setTaskLabels] = useState<number[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: '' });

  const isNewTask = !currentTask?.id && !taskId;
  const currentLabelIds = selectedLabelIds || taskLabels;

  const fetchData = async () => {
    const data = await apiClient.getLabels();
    setLabelData(data);
  };

  const fetchTaskLabels = useCallback(async () => {
    if (!currentTask?.id && !taskId) return;
    try {
      const task = await apiClient.getTaskById(currentTask?.id || taskId!);
      const labelIds = task.labels?.map((label) => label.id) || [];
      setTaskLabels(labelIds);
    } catch (error) {
      console.error('Error fetching task labels:', error);
      setTaskLabels([]);
    }
  }, [currentTask?.id, taskId]);

  useEffect(() => {
    fetchData();
    if (!isNewTask) {
      fetchTaskLabels();
    }
  }, [currentTask?.id, taskId, isNewTask, fetchTaskLabels]);

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

    const newLabelIds = wasAlreadyChecked
      ? selectedLabelIds.filter((id) => id !== targetLabelId)
      : [...selectedLabelIds, targetLabelId];

    onLabelSelectionChange?.(newLabelIds);

    const currentTaskId = currentTask?.id || taskId;
    if (!currentTaskId) return;

    try {
      if (wasAlreadyChecked) {
        await apiClient.removeTaskLabels(currentTaskId, [targetLabelId]);
      } else {
        await apiClient.addTaskLabels(currentTaskId, [targetLabelId]);
      }
    } catch (error) {
      console.error('Error updating task labels:', error);
      onLabelSelectionChange?.(selectedLabelIds);
    }
  };

  const handleLabelCreated = async (newLabel?: Label | undefined) => {
    if (newLabel) {
      await fetchData();
      if (!isNewTask) {
        await fetchTaskLabels();
      }
      setShowPopup(false);
      setSnackbar({
        open: true,
        message: 'Label created successfully!',
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Failed to create label. Please try again.',
      });
    }
  };

  const handleLabelsChanged = async () => {
    await fetchData();
    if (!isNewTask) {
      await fetchTaskLabels();
    }
    if (onLabelsChanged) {
      onLabelsChanged();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message={snackbar.message}
      />
      <div className="text-3xl font-semibold mb-2 flex items-center justify-between">
        <h2 className="text-3xl font-semibold mb-2">Labels</h2>
        <Button
          sx={{
            color: '#424242',
            fontWeight: '550',
            textTransform: 'none',
            fontSize: '16px',
            ml: 2,
          }}
          onClick={() => setShowEditPopup(true)}
        >
          Edit Labels
        </Button>
      </div>
      <div className="transparent-scrollbar-container bg-white w-[344px] h-[100px] rounded-lg p-3 pr-6 grid auto-cols-min auto-rows-min grid-cols-2 gap-x-4 gap-y-2 overflow-scroll">
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
          mt: 1,
        }}
        onClick={() => setShowPopup(true)}
      >
        + Add Label
      </Button>
      {showPopup && (
        <LabelPopup
          onCancel={() => setShowPopup(false)}
          onLabelCreated={handleLabelCreated}
        />
      )}
      {showEditPopup && (
        <EditDeleteLabelPopup
          onClose={() => setShowEditPopup(false)}
          onLabelsChanged={handleLabelsChanged}
        />
      )}
    </div>
  );
};
