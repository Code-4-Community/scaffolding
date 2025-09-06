import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';

interface DueDateProps {
  value: Dayjs | null;
  onChange: (newDate: Dayjs | null) => void;
}

export const DueDate: React.FC<DueDateProps> = ({ value, onChange }) => {
  const isOverdue = value ? value.isBefore(dayjs(), 'day') : false;

  return (
    <div className="flex flex-col max-w-[200px] gap-2">
      {/* Due Date Title and Overdue Flag */}
      <h1 className="text-3xl font-medium">Due Date</h1>
      {isOverdue && <p className="text-red-500 font-medium">*Overdue</p>}
      {/* MUI Date Picker */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker value={value} onChange={onChange} />
      </LocalizationProvider>
    </div>
  );
};
