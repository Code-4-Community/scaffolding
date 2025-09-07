import React from 'react';

interface EditDeleteLabelPopupProps {
  onClose: () => void;
}

const EditDeleteLabelPopup: React.FC<EditDeleteLabelPopupProps> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center">
        <p className="mb-4">Hello World</p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EditDeleteLabelPopup;
