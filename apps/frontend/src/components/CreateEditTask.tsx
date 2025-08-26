import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import apiClient from '@api/apiClient';

/*
TODO: button functionality, add other components and states
*/
interface CreateEditTaskProps {
  taskId?: number;
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

export const CreateEditTask: React.FC<CreateEditTaskProps> = ({ taskId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [taskExists, setTaskExists] = useState(false);

  useEffect(() => {
    if (!taskId) {
      setTaskExists(false);
      return;
    }

    const fetchTaskData = async () => {
      try {
        const task = await apiClient.getTaskById(taskId);
        if (task) {
          setTaskExists(true);
          setTitle(task.title);
          setDescription(task.description || 'Add a description to your task');
        }
      } catch (err) {
        console.log(err);
        setTaskExists(false);
      }
    };
    fetchTaskData();
  }, [taskId]);

  return (
    <div className="flex flex-row m-14 p-8 border border-black bg-[#f6f6f6] rounded-lg relative">
      <div className="w-1/2 flex flex-col">
        <h1 className="text-3xl font-medium mb-4">Title</h1>
        <TextField
          value={taskExists ? title : 'Title of task'}
          variant="outlined"
          onChange={(e) => setTitle(e.target.value)}
          sx={textFieldStyles}
        />
        <h1 className="text-3xl font-medium my-4">Description</h1>
        <TextField
          value={taskExists ? description : 'Description of task'}
          variant="outlined"
          multiline
          onChange={(e) => setDescription(e.target.value)}
          rows={18}
          sx={textFieldStyles}
        />
      </div>
      <div className="w-1/2">
        <Button
          variant="contained"
          sx={{
            ...baseButtonStyles,
            backgroundColor: '#d9d9d9',
            '&:hover': {
              backgroundColor: '#cacacaff',
            },
            bottom: '30px',
            right: '160px',
            color: 'black',
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            ...baseButtonStyles,
            backgroundColor: '#868686',
            fontWeight: 'bold',
            position: 'absolute',
            bottom: '30px',
            right: '30px',
            '&:hover': {
              backgroundColor: '#7d7d7dff',
            },
          }}
        >
          {taskId ? 'Save' : 'Create'}
        </Button>
      </div>
    </div>
  );
};
