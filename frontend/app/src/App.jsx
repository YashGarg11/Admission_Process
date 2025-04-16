import CollegeNavbar from './components/navbar';
import Notice from './components/notice_board';
import './index.css';

function App() {
  // Center-focused path with smaller horizontal range
  const pathData = "M300,250 C350,350 400,350 450,250";

  return (
    <div className="min-h-screen w-full bg-black">
      <CollegeNavbar />
      <div className="pt-[80px] min-h-screen w-full flex flex-col lg:flex-row items-center justify-center gap-8 px-4 py-8 overflow-x-hidden">
        <div className="flex-1 flex justify-center">
          <Notice pathData={pathData} text="Direct Admission" />
        </div>
        <div className="flex-1 flex justify-center">
          <Notice pathData={pathData} text="Counselling" />
        </div>
      </div>
    </div>
  );
}

export default App;
