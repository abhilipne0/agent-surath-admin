import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WithdrawalList from './pages/sub-module/withdrawal/WithdrawalList';
import DepositeList from './pages/sub-module/deposite/DepositeList';
import Summary from './pages/sub-module/summary/Summary';
import Layout from './components/Layout';
import Login from './pages/login/Login';
import AuthenticatedRoute from './routes/AuthenticatedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Dashboard from './pages/sub-module/dashboard/Dashboard';
import SurathDash from './pages/sub-module/dashboard/suarthDash/SurathDash';
import AllDash from './pages/sub-module/dashboard/allDash/AllDash';
import UpiDeposite from './pages/sub-module/deposite/UpiDeposite';
import Agents from './pages/sub-module/dashboard/agents/Agents';
import AgentDashboard from './pages/sub-module/agent-dashboard/AgentDashboard';
import AgentUserDashboard from './pages/sub-module/agent-user-dashboard/AgentUserDashboard';
import Transaction from './pages/sub-module/agent-user-dashboard/component/Transaction';

function App() {
  const token = localStorage.getItem('authToken'); // Adjusted token key

  return (
    <>
      <Routes>
        {/* Public login route */}
        <Route
          path="/login"
          element={token ? <Navigate to="/" /> : <Login />}
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <AuthenticatedRoute>
              <Layout />
            </AuthenticatedRoute>
          }
        >
          {/* Default redirect to /withdrawal-list */}
          <Route
            index
            element={
              localStorage.getItem("role") === "agent" ? (
                <Navigate to="/agent/dashboard" replace />
              ) : (
                <Navigate to="/agents" replace />
              )
            }
          />

          {/* Routes for all pages */}
          <Route
            path="withdrawal-list"
            element={
              <AuthenticatedRoute>
                <WithdrawalList />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="deposite-list"
            element={
              <AuthenticatedRoute>
                {/* <DepositeList /> */}
                <UpiDeposite />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="summary"
            element={
              <AuthenticatedRoute>
                <Summary />
              </AuthenticatedRoute>
            }
          />

          {/* Dashboards Route */}
          <Route
            path="dashboard"
            element={
              <AuthenticatedRoute>
                <AllDash />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="surath-dash"
            element={
              <AuthenticatedRoute>
                <SurathDash />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="agents"
            element={
              <AuthenticatedRoute>
                <Agents />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="agent/dashboard"
            element={
              <AuthenticatedRoute>
                <AgentDashboard />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="agent/user"
            element={
              <AuthenticatedRoute>
                <AgentUserDashboard />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/user/transaction/:userId"
            element={
              <AuthenticatedRoute>
                <Transaction />
              </AuthenticatedRoute>
            }
          />
        </Route>
        {/* 🔁 Catch all unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast container */}
      <ToastContainer />
    </>
  );
}

export default App;
