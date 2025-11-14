import PendingReviewCard from '@components/PendingReviewCard';
import { TimeIcon } from '@chakra-ui/icons';

const Root: React.FC = () => {
  return (
    <>
      Welcome to scaffolding!
      <PendingReviewCard
        title="Total Applications"
        value={298}
        description="All time submissions"
        icon={TimeIcon}
      />
    </>
  );
};

export default Root;
