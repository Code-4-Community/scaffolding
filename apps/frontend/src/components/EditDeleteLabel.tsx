import { Button } from '@mui/material';
import React from 'react';
import EditDeleteLabelPopup from './EditDeleteLabelPopup';

export const EditDeleteLabel = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex justify-end mr-12">
      <Button
        sx={{ backgroundColor: 'blue', color: 'white' }}
        className="flex justify-end mr-16"
        onClick={() => setIsOpen(true)}
      >
        Edit/Delete Labels
      </Button>
      {isOpen && <EditDeleteLabelPopup onClose={() => setIsOpen(false)} />}
    </div>
  );
};
