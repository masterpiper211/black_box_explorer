import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', message: 'Model execution completed successfully', time: '2 min ago', read: false },
    { id: 2, type: 'warning', message: 'High memory usage detected in session #1247', time: '5 min ago', read: false },
    { id: 3, type: 'error', message: 'Connection timeout in live visualizer', time: '8 min ago', read: true },
  ]);
  
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: '/execution-dashboard', 
      icon: 'BarChart3',
      tooltip: 'Real-time execution monitoring and system overview'
    },
    { 
      label: 'Live Visualizer', 
      path: '/live-execution-visualizer', 
      icon: 'Activity',
      tooltip: 'Real-time execution chain visualization and debugging'
    },
    { 
      label: 'Sessions', 
      path: '/session-management', 
      icon: 'Layers',
      tooltip: 'Historical execution management and analysis'
    },
    { 
      label: 'Analytics', 
      path: '/performance-analytics', 
      icon: 'TrendingUp',
      tooltip: 'Performance insights and optimization intelligence'
    },
    { 
      label: 'Configuration', 
      path: '/model-configuration', 
      icon: 'Settings',
      tooltip: 'Model and system administration controls'
    },
    { 
      label: 'Audit', 
      path: '/audit-trail-viewer', 
      icon: 'FileText',
      tooltip: 'Compliance and activity tracking interface'
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Simulate connection status updates
    const interval = setInterval(() => {
      const statuses = ['connected', 'connecting', 'disconnected'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setConnectionStatus(randomStatus);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleNotificationClick = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setIsNotificationOpen(false);
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-success';
      case 'connecting': return 'text-warning';
      case 'disconnected': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return 'Wifi';
      case 'connecting': return 'WifiOff';
      case 'disconnected': return 'WifiOff';
      default: return 'Wifi';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-navigation bg-surface border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Box" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">Black Box Explorer</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-fast hover:bg-muted focus-ring group ${
                  location.pathname === item.path
                    ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground'
                }`}
                title={item.tooltip}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-muted">
            <Icon 
              name={getConnectionStatusIcon()} 
              size={14} 
              className={`${getConnectionStatusColor()} ${connectionStatus === 'connecting' ? 'animate-pulse' : ''}`}
            />
            <span className={`text-xs font-medium capitalize ${getConnectionStatusColor()}`}>
              {connectionStatus}
            </span>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center animate-pulse-slow">
                  {unreadCount}
                </span>
              )}
            </Button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-modal animate-slide-down">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-foreground">Notifications</h3>
                    {notifications.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllNotifications}
                        className="text-xs"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <Icon name="Bell" size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`p-4 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted transition-colors ${
                          !notification.read ? 'bg-accent/5' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <Icon
                            name={
                              notification.type === 'success' ? 'CheckCircle' :
                              notification.type === 'warning'? 'AlertTriangle' : 'XCircle'
                            }
                            size={16}
                            className={
                              notification.type === 'success' ? 'text-success' :
                              notification.type === 'warning'? 'text-warning' : 'text-error'
                            }
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <Button
              variant="ghost"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 px-3 py-2"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">Alex Chen</p>
                <p className="text-xs text-muted-foreground">ML Engineer</p>
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </Button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-modal animate-slide-down">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-border mb-2">
                    <p className="font-medium text-foreground">Alex Chen</p>
                    <p className="text-sm text-muted-foreground">alex.chen@company.com</p>
                    <p className="text-xs text-muted-foreground mt-1">ML Engineer • Admin</p>
                  </div>
                  
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors">
                    <Icon name="User" size={16} />
                    <span>Profile Settings</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors">
                    <Icon name="Settings" size={16} />
                    <span>Preferences</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors">
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                  
                  <div className="border-t border-border mt-2 pt-2">
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-md transition-colors">
                      <Icon name="LogOut" size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden"
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-surface" ref={mobileMenuRef}>
          <nav className="px-6 py-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors duration-fast ${
                  location.pathname === item.path
                    ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </button>
            ))}
            
            {/* Mobile Connection Status */}
            <div className="flex items-center justify-between px-3 py-3 border-t border-border mt-4 pt-4">
              <span className="text-sm text-muted-foreground">Connection Status</span>
              <div className="flex items-center space-x-2">
                <Icon 
                  name={getConnectionStatusIcon()} 
                  size={16} 
                  className={`${getConnectionStatusColor()} ${connectionStatus === 'connecting' ? 'animate-pulse' : ''}`}
                />
                <span className={`text-sm font-medium capitalize ${getConnectionStatusColor()}`}>
                  {connectionStatus}
                </span>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;