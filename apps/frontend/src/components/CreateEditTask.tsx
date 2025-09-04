import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import apiClient from '@api/apiClient';
import { Task, TaskCategory } from '../types/types';
import { CategoryButton } from './CategoryButton';
import { LabelsView } from './LabelsView';
import { DueDate } from './DueDate';
import dayjs, { Dayjs } from 'dayjs';

interface CreateEditTaskProps {
  taskId?: number;
  handleCancel: () => void;
}

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
    },
    backgroundColor: 'white',
    borderRadius: '10px',
  },
};

const baseButtonStyles = {
  textTransform: 'none',
  borderRadius: '10px',
  paddingX: '30px',
  paddingY: '10px',
  fontSize: '18px',
  position: 'absolute',
};

export const CreateEditTask: React.FC<CreateEditTaskProps> = ({
  taskId,
  handleCancel,
}) => {
  const [task, setTask] = useState<Task>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.DRAFT);
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);

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
          setDueDate(task.dueDate ? dayjs(task.dueDate) : null); // convert to Dayjs
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTaskData();
  }, [taskId]);

  const handleSave = () => {
    const updatedTask = {
      ...task,
      title,
      description,
      category,
      dueDate: dueDate?.toISOString() || null,
    };
    console.log('Saving task', updatedTask);
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
          sx={textFieldStyles}
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
          sx={textFieldStyles}
        />
      </div>

      <div className="w-1/2 flex flex-col justify-between pl-6">
        <div>
          <CategoryButton value={category} onChange={setCategory} />

          <div className="flex flex-row mt-8 ml-4 gap-8">
            <LabelsView currentTask={task as Task} />
            <DueDate value={dueDate} onChange={setDueDate} />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="contained"
            sx={{
              ...baseButtonStyles,
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
              ...baseButtonStyles,
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
