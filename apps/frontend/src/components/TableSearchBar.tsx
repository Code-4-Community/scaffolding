import { IoSearch } from 'react-icons/io5';

interface SearchbarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Searchbar({ value, onChange }: SearchbarProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: '8px 16px',
        gap: '10px',
        backgroundColor: '#F8F8F8',
        border: '1px solid #686868',
        borderRadius: '10px',
      }}
    >
      <input
        type="text"
        placeholder="Search applications by name, email"
        value={value}
        onChange={onChange}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          fontFamily: 'Lato, sans-serif',
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '100%',
          color: '#686868',
        }}
      />
      <IoSearch
        style={{
          width: '24px',
          height: '24px',
          padding: '3px',
          color: '#686868',
        }}
      />
    </div>
  );
}

export default Searchbar;
