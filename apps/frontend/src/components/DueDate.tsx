import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';

export const DueDate: React.FC = () => {
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const isOverdue = dueDate ? dueDate.isBefore(dayjs(), 'day') : false;

  return (
    <div className="flex flex-col gap-4">
      {/* Due Date Title and Overdue Flag */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-black">Due Date</span>
        {isOverdue && (
          <span className="text-red-500 font-medium">*Overdue</span>
        )}
      </div>
      {/* MUI Date Picker */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker value={dueDate} onChange={setDueDate} />
      </LocalizationProvider>
    </div>
  );
};
