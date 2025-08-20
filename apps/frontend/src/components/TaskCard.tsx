import React from 'react';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

interface TaskCardProps {
  colors: string[];
  title: string;
  dueDate?: Date;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  colors,
  title,
  dueDate,
}) => {
  return (
    <div className="flex flex-col w-[296px] min-h-[95px] bg-white p-3 rounded-lg relative">
      <div className="flex flex-col">
        <div className="flex flex-row gap-1">
          {colors.map((color, index) => (
            <div
              key={index}
              className="w-[50px] h-[10px] rounded-lg"
              style={{ backgroundColor: color }}
            ></div>
          ))}
          <div className="ml-2">
            {dueDate && Date.now() >= dueDate.getTime() && (
              <WarningAmberOutlinedIcon color="warning" />
            )}
          </div>
        </div>
        <p className="break-words">{title}</p>
      </div>
      {dueDate && (
        <p
          className="text-xs self-end"
          style={
            Date.now() >= dueDate.getTime()
              ? { color: '#FF0004' }
              : { color: '#878787' }
          }
        >
          Due{' '}
          {dueDate.toLocaleDateString(undefined, {
            month: 'numeric',
            day: 'numeric',
          })}
        </p>
      )}
    </div>
  );
};
