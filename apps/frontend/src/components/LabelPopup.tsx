import React, { useState } from 'react';
import { Button } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';

export const LabelPopup: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [colorValue, setColorValue] = useState('#ffffff');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, description, colorValue });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[338px] p-6 border-2 rounded-xl bg-gray-200 space-y-2 text-[28px]"
    >
      <div className="flex flex-col">
        <label className="font-bold">Name</label>
        <input
          type="text"
          placeholder="Label.."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 text-[22px]"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="font-bold">
          Description <span className="text-xs">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="Description.."
          value={name}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 text-[22px]"
          required
        />
      </div>

      <div>
        <label className="font-bold">Color</label>
        <MuiColorInput
          value={colorValue}
          onChange={setColorValue}
          className="w-full"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <button className="w-[88px] bg-white px-3 py-1 text-[20px]">
          Cancel
        </button>
        <button className="w-[88px] bg-gray-500 text-white px-3 py-1 text-[20px]">
          Create
        </button>
      </div>
    </form>
  );
};
