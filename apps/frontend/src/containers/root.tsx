import DashboardCard from '@components/DashboardCard';
import NavBar from '@components/NavBar/NavBar';

import usersIcon from '../assets/icons/users.svg';
import clockIcon from '../assets/icons/clock.svg';
import crossIcon from '../assets/icons/cross.svg';
import checkmarkIcon from '../assets/icons/checkmark.svg';
import { Box } from '@chakra-ui/react';
import ApplicationTable from '@components/ApplicationTable';

const Root: React.FC = () => {
  return (
    <div className="flex flex-row">
      <NavBar logo={'BHCHP'} />
      <Box id="main-content" p="10" flex="1">
        <Box className="flex flex-row gap-6 pl-4 pt-4" marginBottom="5">
          <DashboardCard
            className="basis-1/4"
            title="Total Applications"
            value={298}
            description="All time submissions"
            icon={usersIcon}
          />

          <DashboardCard
            className="basis-1/4"
            title="Pending Review"
            value={52}
            description="Awaiting decision"
            icon={clockIcon}
          />

          <DashboardCard
            className="basis-1/4"
            title="Rejected"
            value={12}
            description="Not matched"
            icon={crossIcon}
          />

          <DashboardCard
            className="basis-1/4"
            title="Approved"
            value={102}
            description="Active volunteers "
            icon={checkmarkIcon}
          />
        </Box>

        <ApplicationTable />
      </Box>
    </div>
  );
};

export default Root;
