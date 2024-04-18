import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MapPage from './pages/mapPage/MapPage';
import SuccessPage from './components/volunteer/signup/SuccessPage';
import VolunteerPage from './pages/volunteerPage/VolunteerPage';
import MyAdoptedGIPage from './pages/myAdoptedGIPage/MyAdoptedGIPage';


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
           <Route path="/volunteer/my-adopted-gi" element={<MyAdoptedGIPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
