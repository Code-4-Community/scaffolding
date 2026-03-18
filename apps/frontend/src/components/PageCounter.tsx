interface PageCounterProps {
  page: number;
  setPage: (page: number) => void;
  maxPages: number;
}

function PageCounter({ page, setPage, maxPages }: PageCounterProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (maxPages <= 4) {
      // Show all pages if 4 or fewer
      for (let i = 1; i <= maxPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first 3 pages when near the start
      if (page <= 3) {
        pages.push(1, 2, 3);
        pages.push('...');
        pages.push(maxPages);
      }
      // Show last 3 pages when near the end
      else if (page >= maxPages - 2) {
        pages.push(1);
        pages.push('...');
        pages.push(maxPages - 2, maxPages - 1, maxPages);
      }
      // Show current page with neighbors in the middle
      else {
        pages.push(1);
        pages.push('...');
        pages.push(page - 1, page, page + 1);
        pages.push('...');
        pages.push(maxPages);
      }
    }

    return pages;
  };

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      {getPageNumbers().map((p, index) =>
        typeof p === 'string' ? (
          <span
            key={`ellipsis-${index}`}
            style={{
              padding: '8px',
              fontFamily: 'Lato, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '100%',
              color: '#686868',
            }}
          >
            {p}
          </span>
        ) : (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              padding: '8px',
              backgroundColor: '#F8F8F8',
              color: '#686868',
              border: '1px solid #686868',
              borderRadius: '10px',
              cursor: 'pointer',
              fontFamily: 'Lato, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {p}
          </button>
        ),
      )}
    </div>
  );
}

export default PageCounter;
