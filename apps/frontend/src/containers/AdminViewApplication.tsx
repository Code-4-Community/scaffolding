import NavBar from '@components/NavBar/NavBar';
import { useParams } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

const AdminViewApplication: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();
  // use appId directly
  return (
    <div className="flex flex-row">
      <NavBar logo={'BHCHP'} />
      <Box id="main-content" p="10" flex="1"></Box>
    </div>
  );
};

export default AdminViewApplication;
