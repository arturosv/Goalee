import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Dashboard from './components/Dashboard';
import InputScreen from './components/InputScreen';
import Trends from './components/Trends';
import Profile from './components/Profile';
import BottomNavigation from './components/BottomNavigation';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <motion.div 
          className="app-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/input" element={<InputScreen />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </motion.div>
        <BottomNavigation />
      </div>
    </Router>
  );
};

export default App; 