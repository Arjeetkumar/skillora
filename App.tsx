
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import FreelancerDashboard from './pages/FreelancerDashboard';
import ClientDashboard from './pages/ClientDashboard';
import FindProjects from './pages/FindProjects';
import Messages from './pages/Messages';
import Checkout from './pages/Checkout';
import JobProposals from './pages/JobProposals';
import MyProposals from './pages/MyProposals';
import JobDetails from './pages/JobDetails';
import ContractView from './pages/ContractView';
import Profile from './pages/Profile';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<FreelancerDashboard />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/find-projects" element={<FindProjects />} />
        <Route path="/job/:jobId" element={<JobDetails />} />
        <Route path="/my-proposals" element={<MyProposals />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/job/:jobId/proposals" element={<JobProposals />} />
        <Route path="/contract/:contractId" element={<ContractView />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
