import { TaskBoard } from '../components/TaskBoard';
import Header from '../components/Header';

const Root: React.FC = () => {
  return (
    <div className="w-screen h-screen bg-[#e8e8e8] py-14 px-10">
      <div className="">
        <Header firstName="Test" lastName="User" />
        <TaskBoard />
      </div>
    </div>
  );
};

export default Root;
