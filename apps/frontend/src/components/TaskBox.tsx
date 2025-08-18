import AddIcon from '@mui/icons-material/Add';

interface TaskBoxProps {
  title: string;
  taskIds?: number[];
}

export const TaskBox: React.FC<TaskBoxProps> = ({ title, taskIds }) => {
  return (
    <div className="flex flex-col justify-between min-h-[200px] border-2 border-black rounded-lg p-4 w-[327px]">
      <div className="flex flex-col gap-4">
        <h3>{title}</h3>

        <div className="flex flex-col gap-4">
          {taskIds && taskIds.length > 0 ? (
            taskIds.map((id) => <div key={id}>Placeholder for Task {id}</div>)
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
