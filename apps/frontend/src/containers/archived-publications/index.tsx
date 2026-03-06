import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import './styles.css';
import {
  STATIC_ARCHIVED,
  RECENTLY_EDITED,
  MOCK_LAST_MODIFIED,
  MOCK_STORIES,
  MOCK_AUTHORS,
} from '@utils/mock-data';
import {
  Anthology,
  AnthologyStatus,
  FilterState,
  DEFAULT_FILTER_STATE,
  SortOption,
} from '../../types';
import FilterModal from './filter-modal/FilterModal';

// Import SVG icons
import DocumentIcon from '../../assets/icons/document.svg';
import SearchIcon from '../../assets/icons/search.svg';
import FilterIcon from '../../assets/icons/filter.svg';
import MenuDotsIcon from '../../assets/icons/menu-dots.svg';
import BookmarkIcon from '../../assets/icons/bookmark.svg';

/** Returns the author names for a given anthology id via the stories join. */
function getAuthors(anthologyId: number): string[] {
  return MOCK_STORIES.filter((s) => s.anthologyId === anthologyId)
    .map((s) => MOCK_AUTHORS.find((a) => a.id === s.authorId)?.name)
    .filter(Boolean) as string[];
}

/**
 * Applies search, filters, and sort to the publication list.
 * Returns a new sorted+filtered array without mutating the original.
 */
function applyFiltersAndSort(
  pubs: Anthology[],
  search: string,
  filters: FilterState,
): Anthology[] {
  let result = [...pubs];

  // Search by title or author
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        getAuthors(p.id).some((a) => a.toLowerCase().includes(q)),
    );
  }

  // Publication date year range
  if (filters.pubDateStart) {
    const start = parseInt(filters.pubDateStart, 10);
    if (!isNaN(start)) {
      result = result.filter((p) => p.published_year >= start);
    }
  }
  if (filters.pubDateEnd) {
    const end = parseInt(filters.pubDateEnd, 10);
    if (!isNaN(end)) {
      result = result.filter((p) => p.published_year <= end);
    }
  }

  if (filters.pubLevels) {
    result = result.filter((p) =>
      filters.pubLevels.some((l) => p.pub_level === l),
    );
  }

  // Inventory range
  if (filters.inventoryMin) {
    const min = parseInt(filters.inventoryMin, 10);
    if (!isNaN(min)) {
      result = result.filter((p) => (p.inventory ?? 0) >= min);
    }
  }
  if (filters.inventoryMax) {
    const max = parseInt(filters.inventoryMax, 10);
    if (!isNaN(max)) {
      result = result.filter((p) => (p.inventory ?? Infinity) <= max);
    }
  }

  // Program — normalize programs to array for comparison
  // Note: original entries 1–2 use 'YABP' and will not match any enum value
  if (filters.programs) {
    result = result.filter((p) =>
      filters.programs.some((g) => p.programs?.includes(g)),
    );
  }

  if (filters.genres.length > 0) {
    result = result.filter((p) =>
      filters.genres.some((g) => p.genres?.includes(g)),
    );
  }

  // Sort
  result.sort((a, b) => {
    switch (filters.sortBy) {
      case SortOption.TITLE_ASC:
        return a.title.localeCompare(b.title);
      case SortOption.AUTHOR_ASC:
        return (getAuthors(a.id)[0] ?? '').localeCompare(
          getAuthors(b.id)[0] ?? '',
        );
      case SortOption.DATE_NEWEST:
        return b.published_year - a.published_year;
      case SortOption.DATE_OLDEST:
        return a.published_year - b.published_year;
    }
  });

  return result;
}

export default function ArchivedPublications() {
  const [publications, setPublications] =
    useState<Anthology[]>(STATIC_ARCHIVED);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(DEFAULT_FILTER_STATE);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const navigate = useNavigate();
  const { tab } = useParams<{ tab: string }>();

  const activeTab =
    tab === 'archived' || tab === 'in-progress' || tab === 'all' ? tab : 'all';

  useEffect(() => {
    fetch('/api/anthologies')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPublications(data as Anthology[]);
        }
      })
      .catch(() => {
        setPublications(STATIC_ARCHIVED);
      });
  }, []);

  const statusFilteredPublications = publications.filter((pub) => {
    if (activeTab === 'archived') {
      return pub.status === AnthologyStatus.ARCHIVED;
    }

    if (activeTab === 'in-progress') {
      return (
        pub.status === AnthologyStatus.NOT_STARTED ||
        pub.status === AnthologyStatus.DRAFTING ||
        pub.status === AnthologyStatus.CAN_BE_SHARED
      );
    }

    return true;
  });

  const filteredPublications = applyFiltersAndSort(
    statusFilteredPublications,
    searchQuery,
    appliedFilters,
  );

  return (
    <div className="archive-wrapper">
      {/* Recently Edited Section */}
      <section className="recently-edited-section">
        <div className="recently-edited-content">
          <h2 className="recently-edited-title">Recently Edited</h2>
          <div className="recently-edited-list">
            {RECENTLY_EDITED.map((pub) => (
              <div
                key={pub.id}
                className="publication-list-item"
                // onClick={() => setSelected(pub)}
              >
                <div className="publication-list-item-content">
                  <div className="publication-list-item-left">
                    <img
                      src={DocumentIcon}
                      alt=""
                      className="publication-list-icon"
                    />
                    <span className="publication-list-title">{pub.title}</span>
                  </div>
                  <div className="publication-list-item-right">
                    <span className="publication-list-modified">
                      Last modified 1 hour ago
                    </span>
                    <img
                      src={MenuDotsIcon}
                      alt=""
                      className="publication-list-menu"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Publications Section */}
      <section className="all-publications-section">
        <div className="all-publications-content">
          {/* Search Header */}
          <div className="publication-search-header">
            <h2 className="publication-search-title">Publications</h2>
            <div className="publication-search-controls">
              <div className="publication-search-input-wrapper">
                <div className="publication-search-input-content">
                  <input
                    type="text"
                    className="publication-search-input"
                    placeholder="Search for a title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <img
                    src={SearchIcon}
                    alt=""
                    className="publication-search-icon"
                  />
                </div>
              </div>
              <button
                type="button"
                className="publication-filter-btn publication-filter-btn--text"
                onClick={() => setIsFilterModalOpen(true)}
                aria-label="Open sort and filter"
              >
                <img
                  src={FilterIcon}
                  alt=""
                  className="publication-filter-icon"
                />
                <span>Filters</span>
              </button>
              <button
                type="button"
                className="publication-create-btn"
                aria-label="Create project"
              >
                Create Project
              </button>
            </div>
          </div>
          <div className="publication-tabs">
            <NavLink
              to="/library/publication/all"
              className={({ isActive }) =>
                `publication-tab ${isActive ? 'publication-tab--active' : ''}`
              }
            >
              All
            </NavLink>
            <NavLink
              to="/library/publication/in-progress"
              className={({ isActive }) =>
                `publication-tab ${isActive ? 'publication-tab--active' : ''}`
              }
            >
              In Progress
            </NavLink>
            <NavLink
              to="/library/publication/archived"
              className={({ isActive }) =>
                `publication-tab ${isActive ? 'publication-tab--active' : ''}`
              }
            >
              Archived
            </NavLink>
          </div>

          {/* Publication Cards Grid */}
          <div className="publication-cards-grid">
            {filteredPublications.map((pub) => (
              <button
                key={pub.id}
                type="button"
                className="publication-card"
                onClick={() => navigate(`/publication/${pub.id}`)}
              >
                <div className="publication-card-image">
                  <img
                    src={
                      pub.photo_url || '/src/assets/images/covers/booktemp.avif'
                    }
                    alt={pub.title}
                    className="publication-card-cover"
                  />
                  <img
                    src={BookmarkIcon}
                    alt=""
                    className="publication-card-bookmark"
                  />
                </div>
                <div className="publication-card-info">
                  <div className="publication-card-details">
                    <h3 className="publication-card-title">{pub.title}</h3>
                    <p className="publication-card-author">
                      {getAuthors(pub.id).join(', ') || 'Author Name'}
                    </p>
                    <div className="publication-card-meta">
                      <span className="publication-card-modified">
                        Last modified {MOCK_LAST_MODIFIED}
                      </span>
                      <img
                        src={MenuDotsIcon}
                        alt=""
                        className="publication-card-menu"
                      />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sort & Filter Modal */}
      {isFilterModalOpen && (
        <FilterModal
          initialFilters={appliedFilters}
          onApply={(filters) => setAppliedFilters(filters)}
          onClose={() => setIsFilterModalOpen(false)}
        />
      )}
    </div>
  );
}
