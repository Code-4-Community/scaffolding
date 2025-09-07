import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import apiClient from '@api/apiClient';
import { Task, TaskCategory, UpdateTaskDTO } from '../types/types';
import { CategoryButton } from './CategoryButton';
import { LabelsView } from './LabelsView';
import { DueDate } from './DueDate';
import dayjs, { Dayjs } from 'dayjs';

interface CreateEditTaskProps {
  taskId?: number;
  defaultCategory?: TaskCategory;
  handleCancel: () => void;
  onTaskSaved?: () => void;
  isEditing?: boolean;
}

export const CreateEditTask: React.FC<CreateEditTaskProps> = ({
  taskId,
  defaultCategory,
  handleCancel,
  onTaskSaved,
  isEditing = false,
}) => {
  const [task, setTask] = useState<Task>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>(
    defaultCategory || TaskCategory.DRAFT,
  );
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [selectedLabelIds, setSelectedLabelIds] = useState<number[]>([]);

  useEffect(() => {
    if (!taskId) return;

    const fetchTaskData = async () => {
      try {
        const task = await apiClient.getTaskById(taskId);
        if (task) {
          setTask(task);
          setTitle(task.title);
          setDescription(task.description);
          setCategory(task.category);
          setDueDate(task.dueDate ? dayjs(task.dueDate) : null);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTaskData();
  }, [taskId]);

  const handleDelete = async () => {
    if (!taskId) return;

    try {
      await apiClient.deleteTask(taskId);
      if (onTaskSaved) {
        onTaskSaved();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSave = async () => {
    try {
      const taskData: UpdateTaskDTO = {
        title,
        description,
        category,
      };

      if (dueDate) {
        taskData.dueDate = dueDate.toISOString();
      }

      if (taskId) {
        // Update existing task
        const savedTask = await apiClient.updateTask(taskId, taskData);

        if (category !== savedTask.category) {
          await apiClient.updateTaskCategory(taskId, { categoryId: category });
        }
      } else {
        // Create new task
        const savedTask = await apiClient.createTask(taskData);

        if (selectedLabelIds.length > 0) {
          try {
            await apiClient.addTaskLabels(savedTask.id, selectedLabelIds);
          } catch (error) {
            console.error('Error applying labels to new task:', error);
          }
        }
      }

      if (onTaskSaved) {
        onTaskSaved();
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <div className="flex flex-row m-14 p-8 border border-black bg-[#f6f6f6] rounded-lg">
      <div className="w-1/2 flex flex-col pr-6">
        <h1 className="text-3xl font-medium mb-4">Title</h1>
        <TextField
          value={title}
          placeholder="Title of task"
          variant="outlined"
          onChange={(e) => setTitle(e.target.value)}
        />
        <h1 className="text-3xl font-medium my-4">Description</h1>
        <TextField
          value={description}
          placeholder={
            taskId ? 'Add a description to your task' : 'Description of task'
          }
          variant="outlined"
          multiline
          onChange={(e) => setDescription(e.target.value)}
          rows={18}
        />
      </div>

      <div className="w-1/2 flex flex-col justify-between pl-6">
        <div>
          <CategoryButton value={category} onChange={setCategory} />

          <div className="flex flex-row mt-8 ml-4 gap-8">
            <LabelsView
              currentTask={task}
              taskId={taskId}
              selectedLabelIds={selectedLabelIds}
              onLabelSelectionChange={setSelectedLabelIds}
            />
            <DueDate value={dueDate} onChange={setDueDate} />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          {isEditing && (
            <Button
              variant="contained"
              sx={{
                position: 'static',
                backgroundColor: 'red',
                color: 'black',
                paddingX: '20px',
                paddingY: '8px',
                fontSize: '16px',
              }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
          <Button
            variant="contained"
            sx={{
              position: 'static',
              backgroundColor: '#d9d9d9',
              '&:hover': { backgroundColor: '#cacacaff' },
              color: 'black',
              paddingX: '20px',
              paddingY: '8px',
              fontSize: '16px',
            }}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              position: 'static',
              backgroundColor: '#868686',
              '&:hover': { backgroundColor: '#7d7d7dff' },
              fontWeight: 'bold',
              paddingX: '20px',
              paddingY: '8px',
              fontSize: '16px',
            }}
            onClick={handleSave}
          >
            {taskId ? 'Save' : 'Create'}
          </Button>
        </div>
      </div>
    </div>
  );
};
