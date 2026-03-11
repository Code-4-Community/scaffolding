import { SortOption } from '../../../types';
import TabFilterRow from './TabFilterRow';
import { SORT_OPTIONS } from './constants';

interface SortSectionProps {
  sortBy: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortSection({ sortBy, onChange }: SortSectionProps) {
  return (
    <section className="filter-modal-section">
      <h3 className="filter-modal-section-title">Sort</h3>
      {/* TabFilterRow is reused for Sort, Publication Level, Program, and Genre.
          Sort uses allowDeselect=false so a sort order is always active. */}
      <TabFilterRow
        options={SORT_OPTIONS}
        selected={sortBy}
        onChange={(value) => value && onChange(value)}
        allowDeselect={false}
      />
    </section>
  );
}
