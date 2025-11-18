import { ApprovedCard } from '@components/ApprovedCard';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';

const Root: React.FC = () => {
  return (
    <>
      Welcome to scaffolding!
      <ApprovedCard
        title="Approved"
        count={102}
        description="Active volunteers"
        icon={<IoCheckmarkCircleOutline />}
      />
    </>
  );
};

export default Root;
