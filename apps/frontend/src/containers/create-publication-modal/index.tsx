import { useState } from "react";
import "./styles.css";
import { THEMES, OMCHAI_ROLES, OmchaiRole } from "./constants";

export interface PublicationFormState {
  title: string;
  publicationType: string;
  themes: string[];
  completionDate: string;
  budget: string;
  description: string;
  owner: string[];
  manager: string[];
  consulted: string[];
  helper: string[];
  approver: string[];
  informed: string[];
}

interface CreatePublicationModalProps {
  onClose: () => void;
  onSave: (form: PublicationFormState) => void;
  teamMembers?: string[];
}

const PUBLICATION_TYPES = [
  { value: "level0", label: "Level 0 (Zines)" },
  { value: "level1", label: "Level 1 (Chapbooks)" },
  { value: "level2", label: "Level 2 (Perfect Bound)" },
  { value: "level3", label: "Level 3 (Signature Publications)" },
];

const INITIAL_FORM: PublicationFormState = {
  title: "",
  publicationType: "",
  themes: [],
  completionDate: "",
  budget: "",
  description: "",
  owner: [],
  manager: [],
  consulted: [],
  helper: [],
  approver: [],
  informed: [],
};

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  tagClass: string;
  selectedOptionClass: string;
}

function MultiSelect({ options, selected, onChange, tagClass, selectedOptionClass }: MultiSelectProps) {
  const [expanded, setExpanded] = useState(false);

  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
  };

  const VISIBLE_COUNT = 6;
  const visibleOptions = expanded ? options : options.slice(0, VISIBLE_COUNT);
  const hiddenCount = options.length - VISIBLE_COUNT;

  return (
    <div className="multiselect__wrapper">
      {selected.length > 0 && (
        <div className="multiselect__tags">
          {selected.map(s => (
            <span key={s} className={`multiselect__tag ${tagClass}`}>
              {s}
              <span
                className="multiselect__tag-remove"
                onClick={e => { e.stopPropagation(); toggle(s); }}
              >×</span>
            </span>
          ))}
        </div>
      )}
      <div className="multiselect__options-inline">
        {visibleOptions.map(opt => (
          <span
            key={opt}
            onClick={() => toggle(opt)}
            className={`multiselect__option-pill ${selected.includes(opt) ? selectedOptionClass : ""}`}
          >
            {opt}
          </span>
        ))}
        {!expanded && hiddenCount > 0 && (
          <span className="multiselect__expand" onClick={() => setExpanded(true)}>
            +{hiddenCount} more
          </span>
        )}
        {expanded && (
          <span className="multiselect__expand" onClick={() => setExpanded(false)}>
            Show less
          </span>
        )}
      </div>
    </div>
  );
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
        {label} {required && <span className="field__required"></span>}
      </label>
      {children}
    </div>
  );
}

function TagInput({ selected, onChange }: { selected: string[]; onChange: (val: string[]) => void }) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !selected.includes(trimmed)) onChange([...selected, trimmed]);
    setInput("");
  };

  const remove = (name: string) => onChange(selected.filter(s => s !== name));

  return (
    <div className="taginput">
      {selected.length > 0 && (
        <div className="taginput__tags">
          {selected.map(s => (
            <span key={s} className="multiselect__tag multiselect__tag--theme">
              {s}
              <span className="multiselect__tag-remove" onClick={() => remove(s)}>×</span>
            </span>
          ))}
        </div>
      )}
      <input
        className="input"
        placeholder="Type a name and press Enter"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && add()}
      />
    </div>
  );
}

export default function CreatePublicationModal({ onClose, onSave }: CreatePublicationModalProps) {
  const [tab, setTab] = useState<0 | 1>(0);
  const [form, setForm] = useState<PublicationFormState>(INITIAL_FORM);

  const set = <K extends keyof PublicationFormState>(k: K, v: PublicationFormState[K]) => {
    setForm(f => ({ ...f, [k]: v }));
  };

  const tab1Valid: boolean =
    form.title.trim().length > 0 &&
    form.publicationType.length > 0 &&
    form.themes.length > 0;

  const tab2Valid: boolean = OMCHAI_ROLES.every((r: OmchaiRole) => form[r.key].length > 0);

  const GoalsField = (
    <Field label="Goals">
      <textarea
        className="input input--textarea"
        placeholder="Include # students published, # editorial board members, consult your manager to ensure that they align with WR team goals"
        value={form.description}
        onChange={e => set("description", e.target.value)}
      />
    </Field>
  );

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__header">
          <div className="modal__header-row">
            <h1 className="modal__title">New Publication</h1>
            <button className="modal__close" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="modal__body">
          {tab === 0 ? (
            <>
              <Field label="Title" required>
                <input
                  className="input"
                  placeholder="Enter publication title"
                  value={form.title}
                  onChange={e => set("title", e.target.value)}
                />
              </Field>

              <Field label="Publication Type" required>
                <select
                  className="input input--select"
                  value={form.publicationType}
                  onChange={e => set("publicationType", e.target.value)}
                >
                  <option value="" disabled>Select a publication type</option>
                  {PUBLICATION_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </Field>

              <Field label="Theme(s)" required>
                <MultiSelect
                  options={THEMES}
                  selected={form.themes}
                  onChange={v => set("themes", v)}
                  tagClass="multiselect__tag--theme"
                  selectedOptionClass="multiselect__option--selected-theme"
                />
              </Field>

              <div className="field-row">
                <Field label="Completion Date">
                  <input
                    className="input"
                    type="date"
                    value={form.completionDate}
                    onChange={e => set("completionDate", e.target.value)}
                  />
                </Field>
                <Field label="Budget">
                  <div className="input-money">
                    <span className="input-money__symbol">$</span>
                    <input
                      className="input input--money"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.budget}
                      onChange={e => set("budget", e.target.value)}
                    />
                  </div>
                </Field>
              </div>

              {GoalsField}
            </>
          ) : (
            <>
              {OMCHAI_ROLES.map(({ key, label }: OmchaiRole) => (
                <Field key={key} label={label} required>
                  <TagInput selected={form[key]} onChange={v => set(key, v)} />
                </Field>
              ))}

              {GoalsField}
            </>
          )}
        </div>

        <div className="modal__footer">
          {tab === 1 && (
            <button className="btn btn--secondary modal__back" onClick={() => setTab(0)}>
              Back
            </button>
          )}
          <div className="modal__footer-right">
            <button
              className="btn btn--primary"
              onClick={tab === 0 ? () => setTab(1) : () => onSave(form)}
              disabled={tab === 0 ? !tab1Valid : !tab2Valid}
            >
              {tab === 0 ? "Next" : "Save as Draft"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}