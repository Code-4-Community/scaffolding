import React, { useState } from 'react';
import { MuiColorInput } from 'mui-color-input';

export const LabelPopup: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [colorValue, setColorValue] = useState('#ffffff');

  // TODO: button functionality
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, description, colorValue });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[278px] px-4 py-1 border-2 rounded-xl bg-gray-100 space-y-2 text-[18px] text-[#424242]"
    >
      <div className="flex flex-col gap-1">
        <label className="font-medium">Name</label>
        <input
          type="text"
          placeholder="Label.."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-[211px] px-3 text-[14px]"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium">
          Description <span className="text-xs">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="Description.."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-[211px] px-3 text-[14px]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium">Color</label>
        <MuiColorInput
          value={colorValue}
          onChange={setColorValue}
          className="w-full"
        />
      </div>

      <div className="flex justify-end space-x-2 py-2">
        <button className="w-[60px] bg-gray-200 px-3 py-1 text-[12px]">
          Cancel
        </button>
        <button className="w-[60px] bg-gray-500 text-white px-3 py-1 text-[12px]">
          Create
        </button>
      </div>
    </form>
  );
};
