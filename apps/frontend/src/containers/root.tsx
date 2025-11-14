import PendingReviewCard from '@components/PendingReviewCard';
import { FaClock } from 'react-icons/fa';

const Root: React.FC = () => {
  return (
    <>
      Welcome to scaffolding!
      <PendingReviewCard
        title="Total Applications"
        value={298}
        description="All time submissions"
        icon={<FaClock />}
      />
    </>
  );
};

export default Root;
