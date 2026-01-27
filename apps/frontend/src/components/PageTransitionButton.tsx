import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

function PageTransitionButton({
  buttonType,
  onClick,
}: {
  buttonType: 'previous' | 'next';
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '10px',
        padding: '8px',
        backgroundColor: '#F8F8F8',
        border: '1px solid #686868',
        borderRadius: '10px',
        cursor: 'pointer',
        fontFamily: 'Lato, sans-serif',
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '100%',
        color: '#686868',
      }}
    >
      {buttonType === 'previous' && (
        <IoChevronBack style={{ width: '14px', height: '14px' }} />
      )}
      <span>{buttonType === 'previous' ? 'Previous' : 'Next'}</span>
      {buttonType === 'next' && (
        <IoChevronForward style={{ width: '14px', height: '14px' }} />
      )}
    </button>
  );
}

export default PageTransitionButton;
