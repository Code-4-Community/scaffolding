import apiClient from '@api/apiClient';
import AddIcon from '@mui/icons-material/Add';
import { Task } from 'types/types';
import { TaskCard } from './TaskCard';

interface TaskBoxProps {
  title: string;
  tasks?: Task[];
  onTaskDrop?: () => void;
  handleClick: (taskId: number) => void;
}

export const TaskBox: React.FC<TaskBoxProps> = ({
  title,
  tasks,
  onTaskDrop,
  handleClick,
}) => {
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    task: Task,
    fromBoxCategory: string,
  ) => {
    e.dataTransfer.setData('taskID', task.id.toString());
    e.dataTransfer.setData('fromBoxCategory', fromBoxCategory);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    toBoxCategory: string,
  ) => {
    e.preventDefault();
    const taskID = parseInt(e.dataTransfer.getData('taskID'));
    const fromBoxCategory = e.dataTransfer.getData('fromBoxCategory');

    if (!taskID || fromBoxCategory === toBoxCategory) return; // ignore invalid drops

    await apiClient.updateTaskCategory(taskID, { categoryId: toBoxCategory });
    if (onTaskDrop) onTaskDrop();
  };

  return (
    <div
      onDrop={(e) => handleDrop(e, title)}
      onDragOver={handleDragOver}
      className="flex flex-col justify-between min-h-[200px] border-2 border-black rounded-lg p-4 w-[327px]"
    >
      <div className="flex flex-col gap-4">
        <h3>{title}</h3>

        <div className="flex flex-col gap-4">
          {tasks && tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className="hover:cursor-pointer"
                draggable
                onDragStart={(e) => handleDragStart(e, task, title)}
                onClick={() => handleClick(task.id)}
              >
                <TaskCard
                  colors={[]}
                  title={task.title}
                  dueDate={task.dueDate ? new Date(task.dueDate) : undefined}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">There are no current tasks.</p>
          )}
        </div>
      </div>

      <button className="flex items-center gap-1 mt-4 w-[40%]">
        <AddIcon sx={{ color: '#4A4A51' }} />
        <span style={{ color: '#4A4A51' }}>Add Card</span>
      </button>
    </div>
  );
};
