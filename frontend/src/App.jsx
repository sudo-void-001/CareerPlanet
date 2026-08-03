import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Navbar from './components/common/Navbar';
import Register from './pages/auth/Register';
import Landing from './pages/public/Landing';
import Jobs from './pages/student/Jobs';
import Applications from './pages/student/Applications';
import Resume from './pages/student/Resume';
import Onboarding from './pages/student/Onboarding';
import RecruiterDashboard from './pages/recruiter/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AIAssistant from './components/ai/AIAssistant';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
      <AIAssistant />
    </BrowserRouter>
  );
}

export default App;
