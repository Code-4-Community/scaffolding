import { useState } from 'react';
import '../../containers/create-publication-modal/styles.css';

interface Props {
  onClose: () => void;
  onSave: (draft: {
    firstName: string;
    lastName: string;
    nameInBook: string;
    classPeriod: string;
    docLink: string;
  }) => void;
}

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, required = false, children }: FieldProps) {
  return (
    <div className="field">
      <label className="field__label">
        {label} {required && <span className="field__required">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function NewStoryDraftModal({ onClose, onSave }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameInBook, setNameInBook] = useState('');
  const [classPeriod, setClassPeriod] = useState('');
  const [docLink, setDocLink] = useState('');

  const isValid = firstName.trim() && lastName.trim() && docLink.trim();

  const handleSave = () => {
    if (!isValid) return;
    onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nameInBook,
      classPeriod,
      docLink,
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__header">
          <div className="modal__header-row">
            <h1 className="modal__title">New Story Draft</h1>
            <button className="modal__close" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="modal__body">
          <div className="field-row">
            <Field label="First Name" required>
              <input
                className="input"
                placeholder="Author's first name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </Field>
            <Field label="Last Name" required>
              <input
                className="input"
                placeholder="Author's last name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </Field>
          </div>

          <Field label="Name in Book">
            <input
              className="input"
              placeholder="Author's name as it appears in the book"
              value={nameInBook}
              onChange={e => setNameInBook(e.target.value)}
            />
          </Field>

          <Field label="Class Period">
            <input
              className="input"
              placeholder="e.g. Edwards 1/6"
              value={classPeriod}
              onChange={e => setClassPeriod(e.target.value)}
            />
          </Field>

          <Field label="Document Link" required>
            <input
              className="input"
              placeholder="Paste Google Doc or Drive link"
              value={docLink}
              onChange={e => setDocLink(e.target.value)}
            />
          </Field>
        </div>

        <div className="modal__footer">
          <div className="modal__footer-right">
            <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
            <button
              className="btn btn--primary"
              onClick={handleSave}
              disabled={!isValid}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}