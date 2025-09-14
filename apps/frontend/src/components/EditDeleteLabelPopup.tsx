import React, { useEffect, useState } from 'react';
import apiClient from '@api/apiClient';
import { Label } from 'types/types';
import { MuiColorInput } from 'mui-color-input';
import { Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Edit from '@mui/icons-material/Edit';
import { toHex } from './AddLabelPopup';

interface EditDeleteLabelPopupProps {
  onClose: () => void;
  onLabelsChanged?: () => void;
}

const EditDeleteLabelPopup: React.FC<EditDeleteLabelPopupProps> = ({
  onClose,
  onLabelsChanged,
}) => {
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#ffffff');

  useEffect(() => {
    const fetchLabels = async () => {
      const data = await apiClient.getLabels();
      setLabels(data);
    };
    fetchLabels();
  }, []);

  useEffect(() => {
    if (selectedLabel) {
      setEditName(selectedLabel.name);
      setEditColor(selectedLabel.color);
    }
  }, [selectedLabel]);

  const handleDelete = async () => {
    if (!selectedLabel) return;
    try {
      await apiClient.deleteLabel(selectedLabel.id);
      setLabels(labels.filter((l) => l.id !== selectedLabel.id));
      setSelectedLabel(null);
      if (onLabelsChanged) onLabelsChanged();
    } catch (err) {
      console.error('Failed to delete label', err);
    }
  };

  const handleSave = async () => {
    if (!selectedLabel) return;
    try {
      const updated = await apiClient.updateLabel(selectedLabel.id, {
        name: editName,
        color: toHex(editColor),
      });
      setLabels(labels.map((l) => (l.id === updated.id ? updated : l)));
      setSelectedLabel(null);
      if (onLabelsChanged) onLabelsChanged();
    } catch (err) {
      console.error('Failed to update label', err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-200 bg-opacity-95">
      <div className="bg-white rounded-lg flex flex-col w-[350px] h-[400px] p-4 relative shadow-lg">
        <h1 className="text-lg text-center font-semibold mb-4">Labels</h1>
        {!selectedLabel ? (
          <>
            <div className="transparent-scrollbar-container h-[300px] w-full px-2 flex flex-col gap-y-2 overflow-scroll mb-4 ">
              {labels.map((label) => (
                <div className="flex flex-row gap-2 items-center">
                  <div
                    key={label.id}
                    className={
                      'flex items-center w-5/6 min-h-[36px] rounded-xl cursor-pointer px-4'
                    }
                    style={{ backgroundColor: label.color }}
                    onClick={() => setSelectedLabel(label)}
                    title={label.name}
                  >
                    <span className="text-sm font-medium">{label.name}</span>
                  </div>
                  <Edit
                    onClick={() => setSelectedLabel(label)}
                    sx={{
                      '&:hover': {
                        cursor: 'pointer',
                      },
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center w-full px-6">
              <Button
                variant="contained"
                color="inherit"
                sx={{
                  color: 'black',
                  backgroundColor: '#e5e7eb',
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#d1d5db' },
                }}
                onClick={onClose}
                type="button"
              >
                Close
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center w-full px-2 pt-4">
              <IconButton onClick={() => setSelectedLabel(null)}>
                <ArrowBackIcon />
              </IconButton>
              <p className="ml-2 text-lg font-medium">Edit Labels</p>
            </div>
            <form
              className="flex flex-col gap-3 w-full px-6 pt-2 flex-1"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Name</span>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Color</span>
                <MuiColorInput
                  value={editColor}
                  onChange={setEditColor}
                  className="w-full"
                />
              </label>
            </form>
            <div className="flex justify-between items-center w-full px-6 pb-4">
              <Button
                variant="contained"
                color="error"
                sx={{ color: 'white', minWidth: 0, px: 3 }}
                onClick={handleDelete}
                type="button"
              >
                Delete
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ color: 'white', minWidth: 0, px: 3 }}
                onClick={handleSave}
                type="button"
              >
                Save
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditDeleteLabelPopup;
