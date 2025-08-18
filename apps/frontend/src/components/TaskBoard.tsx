import React from 'react';
import { TaskBox } from './TaskBox';

// TOOD: Replace this with actual data from the backend
const tasksData = [
  { title: 'Task Box 1', taskIds: [1, 2] },
  { title: 'Task Box 2', taskIds: [3] },
  { title: 'Task Box 3', taskIds: [] },
  { title: 'Task Box 4', taskIds: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
];

export const TaskBoard: React.FC = () => {
  return (
    <div className="flex flex-row gap-4 p-4 items-start justify-center">
      {tasksData.map((task, index) => (
        <TaskBox key={index} title={task.title} taskIds={task.taskIds} />
      ))}
    </div>
  );
};
