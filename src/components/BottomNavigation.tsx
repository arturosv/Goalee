import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Plus, TrendingUp, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/input', icon: Plus, label: 'Add Food' },
    { path: '/trends', icon: TrendingUp, label: 'Trends' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <motion.div
      className="bottom-nav"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={24} />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  className="absolute -top-1 w-1 h-1 bg-blue-500 rounded-full"
                  layoutId="activeIndicator"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BottomNavigation; 