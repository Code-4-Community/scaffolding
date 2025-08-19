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
    <div className="w-[296px] min-h-[95px] p-3 bg-slate-200 rounded-lg relative">
      <div className="flex flex-row gap-1">
        {colors.map((color, index) => (
          <div
            key={index}
            className="w-[50px] h-[10px] rounded-lg"
            style={{ backgroundColor: color }}
          ></div>
        ))}
        {dueDate && Date.now() >= dueDate.getTime() ? (
          <WarningAmberOutlinedIcon
            className="absolute right-2 top-2 bg-[#fef5e6]"
            color="warning"
          />
        ) : (
          <></>
        )}
      </div>
      <p className="mt-2">{title}</p>
      {dueDate ? (
        <p
          className="text-xs absolute right-2 bottom-3"
          style={
            Date.now() >= dueDate.getTime()
              ? { color: '#FF0004' }
              : { color: '#878787' }
          }
        >
          Due {dueDate.getMonth() + 1}/{dueDate.getDate()}
        </p>
      ) : (
        <></>
      )}
    </div>
  );
};
