import DashboardCard from '@components/DashboardCard';
import NavBar from '@components/NavBar/NavBar';

import usersIcon from '../assets/icons/users.svg';
import clockIcon from '../assets/icons/clock.svg';
import crossIcon from '../assets/icons/cross.svg';
import checkmarkIcon from '../assets/icons/checkmark.svg';
import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import PageTransitionButton from '@components/PageTransitionButton';
import Searchbar from '@components/Searchbar';
import PageCounter from '@components/PageCounter';

interface UserData {
  id: number;
  name: string;
  email: string;
}

const Root: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 25;
  const data = [
    { id: 1, name: 'Alice Johnson', email: 'alice.johnson@email.com' },
    { id: 2, name: 'Bob Martinez', email: 'bob.martinez@email.com' },
    { id: 3, name: 'Carol Williams', email: 'carol.williams@email.com' },
    { id: 4, name: 'David Chen', email: 'david.chen@email.com' },
    { id: 5, name: 'Emma Thompson', email: 'emma.thompson@email.com' },
    { id: 6, name: 'Frank Garcia', email: 'frank.garcia@email.com' },
    { id: 7, name: 'Grace Lee', email: 'grace.lee@email.com' },
    { id: 8, name: 'Henry Wilson', email: 'henry.wilson@email.com' },
    { id: 9, name: 'Ivy Patel', email: 'ivy.patel@email.com' },
    { id: 10, name: 'Jack Robinson', email: 'jack.robinson@email.com' },
    { id: 11, name: 'Karen Davis', email: 'karen.davis@email.com' },
    { id: 12, name: 'Liam Brown', email: 'liam.brown@email.com' },
    { id: 13, name: 'Mia Anderson', email: 'mia.anderson@email.com' },
    { id: 14, name: 'Noah Taylor', email: 'noah.taylor@email.com' },
    { id: 15, name: 'Olivia Thomas', email: 'olivia.thomas@email.com' },
    { id: 16, name: 'Peter Jackson', email: 'peter.jackson@email.com' },
    { id: 17, name: 'Quinn White', email: 'quinn.white@email.com' },
    { id: 18, name: 'Rachel Harris', email: 'rachel.harris@email.com' },
    { id: 19, name: 'Sam Martin', email: 'sam.martin@email.com' },
    { id: 20, name: 'Tina Clark', email: 'tina.clark@email.com' },
    { id: 21, name: 'Uma Rodriguez', email: 'uma.rodriguez@email.com' },
    { id: 22, name: 'Victor Lewis', email: 'victor.lewis@email.com' },
    { id: 23, name: 'Wendy Walker', email: 'wendy.walker@email.com' },
    { id: 24, name: 'Xavier Hall', email: 'xavier.hall@email.com' },
    { id: 25, name: 'Yara Allen', email: 'yara.allen@email.com' },
    { id: 26, name: 'Zach Young', email: 'zach.young@email.com' },
    { id: 27, name: 'Amber King', email: 'amber.king@email.com' },
    { id: 28, name: 'Brian Scott', email: 'brian.scott@email.com' },
    { id: 29, name: 'Chloe Green', email: 'chloe.green@email.com' },
    { id: 30, name: 'Derek Adams', email: 'derek.adams@email.com' },
    { id: 1, name: 'Alice Johnson', email: 'alice.johnson@email.com' },
    { id: 2, name: 'Bob Martinez', email: 'bob.martinez@email.com' },
    { id: 3, name: 'Carol Williams', email: 'carol.williams@email.com' },
    { id: 4, name: 'David Chen', email: 'david.chen@email.com' },
    { id: 5, name: 'Emma Thompson', email: 'emma.thompson@email.com' },
    { id: 6, name: 'Frank Garcia', email: 'frank.garcia@email.com' },
    { id: 7, name: 'Grace Lee', email: 'grace.lee@email.com' },
    { id: 8, name: 'Henry Wilson', email: 'henry.wilson@email.com' },
    { id: 9, name: 'Ivy Patel', email: 'ivy.patel@email.com' },
    { id: 10, name: 'Jack Robinson', email: 'jack.robinson@email.com' },
    { id: 11, name: 'Karen Davis', email: 'karen.davis@email.com' },
    { id: 12, name: 'Liam Brown', email: 'liam.brown@email.com' },
    { id: 13, name: 'Mia Anderson', email: 'mia.anderson@email.com' },
    { id: 14, name: 'Noah Taylor', email: 'noah.taylor@email.com' },
    { id: 15, name: 'Olivia Thomas', email: 'olivia.thomas@email.com' },
    { id: 16, name: 'Peter Jackson', email: 'peter.jackson@email.com' },
    { id: 17, name: 'Quinn White', email: 'quinn.white@email.com' },
    { id: 18, name: 'Rachel Harris', email: 'rachel.harris@email.com' },
    { id: 19, name: 'Sam Martin', email: 'sam.martin@email.com' },
    { id: 20, name: 'Tina Clark', email: 'tina.clark@email.com' },
    { id: 21, name: 'Uma Rodriguez', email: 'uma.rodriguez@email.com' },
    { id: 22, name: 'Victor Lewis', email: 'victor.lewis@email.com' },
    { id: 23, name: 'Wendy Walker', email: 'wendy.walker@email.com' },
    { id: 24, name: 'Xavier Hall', email: 'xavier.hall@email.com' },
    { id: 25, name: 'Yara Allen', email: 'yara.allen@email.com' },
    { id: 26, name: 'Zach Young', email: 'zach.young@email.com' },
    { id: 27, name: 'Amber King', email: 'amber.king@email.com' },
    { id: 28, name: 'Brian Scott', email: 'brian.scott@email.com' },
    { id: 29, name: 'Chloe Green', email: 'chloe.green@email.com' },
    { id: 30, name: 'Derek Adams', email: 'derek.adams@email.com' },
    { id: 1, name: 'Alice Johnson', email: 'alice.johnson@email.com' },
    { id: 2, name: 'Bob Martinez', email: 'bob.martinez@email.com' },
    { id: 3, name: 'Carol Williams', email: 'carol.williams@email.com' },
    { id: 4, name: 'David Chen', email: 'david.chen@email.com' },
    { id: 5, name: 'Emma Thompson', email: 'emma.thompson@email.com' },
    { id: 6, name: 'Frank Garcia', email: 'frank.garcia@email.com' },
    { id: 7, name: 'Grace Lee', email: 'grace.lee@email.com' },
    { id: 8, name: 'Henry Wilson', email: 'henry.wilson@email.com' },
    { id: 9, name: 'Ivy Patel', email: 'ivy.patel@email.com' },
    { id: 10, name: 'Jack Robinson', email: 'jack.robinson@email.com' },
    { id: 11, name: 'Karen Davis', email: 'karen.davis@email.com' },
    { id: 12, name: 'Liam Brown', email: 'liam.brown@email.com' },
    { id: 13, name: 'Mia Anderson', email: 'mia.anderson@email.com' },
    { id: 14, name: 'Noah Taylor', email: 'noah.taylor@email.com' },
    { id: 15, name: 'Olivia Thomas', email: 'olivia.thomas@email.com' },
    { id: 16, name: 'Peter Jackson', email: 'peter.jackson@email.com' },
    { id: 17, name: 'Quinn White', email: 'quinn.white@email.com' },
    { id: 18, name: 'Rachel Harris', email: 'rachel.harris@email.com' },
    { id: 19, name: 'Sam Martin', email: 'sam.martin@email.com' },
    { id: 20, name: 'Tina Clark', email: 'tina.clark@email.com' },
    { id: 21, name: 'Uma Rodriguez', email: 'uma.rodriguez@email.com' },
    { id: 22, name: 'Victor Lewis', email: 'victor.lewis@email.com' },
    { id: 23, name: 'Wendy Walker', email: 'wendy.walker@email.com' },
    { id: 24, name: 'Xavier Hall', email: 'xavier.hall@email.com' },
    { id: 25, name: 'Yara Allen', email: 'yara.allen@email.com' },
    { id: 26, name: 'Zach Young', email: 'zach.young@email.com' },
    { id: 27, name: 'Amber King', email: 'amber.king@email.com' },
    { id: 28, name: 'Brian Scott', email: 'brian.scott@email.com' },
    { id: 29, name: 'Chloe Green', email: 'chloe.green@email.com' },
    { id: 30, name: 'Derek Adams', email: 'derek.adams@email.com' },
    { id: 1, name: 'Alice Johnson', email: 'alice.johnson@email.com' },
    { id: 2, name: 'Bob Martinez', email: 'bob.martinez@email.com' },
    { id: 3, name: 'Carol Williams', email: 'carol.williams@email.com' },
    { id: 4, name: 'David Chen', email: 'david.chen@email.com' },
    { id: 5, name: 'Emma Thompson', email: 'emma.thompson@email.com' },
    { id: 6, name: 'Frank Garcia', email: 'frank.garcia@email.com' },
    { id: 7, name: 'Grace Lee', email: 'grace.lee@email.com' },
    { id: 8, name: 'Henry Wilson', email: 'henry.wilson@email.com' },
    { id: 9, name: 'Ivy Patel', email: 'ivy.patel@email.com' },
    { id: 10, name: 'Jack Robinson', email: 'jack.robinson@email.com' },
    { id: 11, name: 'Karen Davis', email: 'karen.davis@email.com' },
    { id: 12, name: 'Liam Brown', email: 'liam.brown@email.com' },
    { id: 13, name: 'Mia Anderson', email: 'mia.anderson@email.com' },
    { id: 14, name: 'Noah Taylor', email: 'noah.taylor@email.com' },
    { id: 15, name: 'Olivia Thomas', email: 'olivia.thomas@email.com' },
    { id: 16, name: 'Peter Jackson', email: 'peter.jackson@email.com' },
    { id: 17, name: 'Quinn White', email: 'quinn.white@email.com' },
    { id: 18, name: 'Rachel Harris', email: 'rachel.harris@email.com' },
    { id: 19, name: 'Sam Martin', email: 'sam.martin@email.com' },
    { id: 20, name: 'Tina Clark', email: 'tina.clark@email.com' },
    { id: 21, name: 'Uma Rodriguez', email: 'uma.rodriguez@email.com' },
    { id: 22, name: 'Victor Lewis', email: 'victor.lewis@email.com' },
    { id: 23, name: 'Wendy Walker', email: 'wendy.walker@email.com' },
    { id: 24, name: 'Xavier Hall', email: 'xavier.hall@email.com' },
    { id: 25, name: 'Yara Allen', email: 'yara.allen@email.com' },
    { id: 26, name: 'Zach Young', email: 'zach.young@email.com' },
    { id: 27, name: 'Amber King', email: 'amber.king@email.com' },
    { id: 28, name: 'Brian Scott', email: 'brian.scott@email.com' },
    { id: 29, name: 'Chloe Green', email: 'chloe.green@email.com' },
    { id: 30, name: 'Derek Adams', email: 'derek.adams@email.com' },
  ];
  const [userData] = useState<UserData[]>(data);
  const [page, setPage] = useState(1);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }
  return (
    <div className="flex flex-row h-screen">
      <NavBar logo={'BHCHP'} />
      <Box
        id="main-content"
        p="10"
        flex="1"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        <Box className="flex flex-row gap-6 pl-4 pt-4">
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
        <div
          style={{
            marginTop: '20px',
            marginBottom: '20px',
            fontFamily: 'Lato, sans-serif',
            fontSize: '20px',
            fontWeight: 700,
            lineHeight: '100%',
            color: '#000000',
          }}
        >
          <p>Recent Applications</p>
        </div>

        <Searchbar value={searchQuery} onChange={onChange}></Searchbar>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {userData
            .filter((item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .slice((page - 1) * pageSize, page * pageSize)
            .map((item) => (
              <div key={item.id}>
                <p>
                  {item.name} - {item.email}
                </p>
              </div>
            ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <PageTransitionButton
            buttonType="previous"
            onClick={() => setPage(page - 1)}
          />
          <PageCounter
            page={page}
            setPage={setPage}
            maxPages={Math.ceil(userData.length / pageSize)}
          />
          <PageTransitionButton
            buttonType="next"
            onClick={() => setPage(page + 1)}
          />
        </div>
      </Box>
    </div>
  );
};

export default Root;
